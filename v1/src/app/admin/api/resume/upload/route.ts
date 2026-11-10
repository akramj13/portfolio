import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth, createUnauthorizedResponse } from "@/lib/auth";
import { cdnUploader } from "@/lib/cdn-uploader";
import { execSync } from "child_process";

export async function POST(req: NextRequest) {
  console.log("Resume upload request received");

  // Verify admin authentication
  const isAuthorized = await verifyAdminAuth(req);
  if (!isAuthorized) {
    return createUnauthorizedResponse();
  }

  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resume") as File;

    if (!resumeFile) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF, DOC, or DOCX file." },
        { status: 400 }
      );
    }

    // Check file size (limit to 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (resumeFile.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Please upload a file smaller than 10MB." },
        { status: 400 }
      );
    }

    console.log(
      "Processing resume file:",
      resumeFile.name,
      "Size:",
      resumeFile.size
    );

    // Get file extension
    const fileExtension =
      resumeFile.name.split(".").pop()?.toLowerCase() || "pdf";

    try {
      // Check if current resume.pdf exists and rename it with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupFileName = `resume-backup-${timestamp}.${fileExtension}`;

      console.log("Checking for existing resume...");
      try {
        // Try to rename existing resume.pdf to backup
        execSync(
          `docker exec portfolio-cdn mv /usr/share/nginx/html/resume.pdf /usr/share/nginx/html/${backupFileName} 2>/dev/null || true`,
          { encoding: "utf8" }
        );
        console.log("Existing resume backed up as:", backupFileName);
      } catch (error) {
        console.log(
          "No existing resume found or backup failed (continuing anyway):",
          error
        );
      }

      // Upload new resume as resume.pdf (regardless of original extension)
      const cdnUrl = await cdnUploader.uploadFile(resumeFile, "resume.pdf");

      console.log("New resume uploaded successfully:", cdnUrl);

      return NextResponse.json(
        {
          success: true,
          message: "Resume uploaded successfully",
          url: cdnUrl,
          backupFile: backupFileName,
        },
        { status: 200 }
      );
    } catch (uploadError) {
      console.error("Error during resume upload process:", uploadError);
      return NextResponse.json(
        {
          error: "Failed to upload resume",
          details:
            uploadError instanceof Error
              ? uploadError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing resume upload:", error);
    return NextResponse.json(
      {
        error: "Failed to process resume upload",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

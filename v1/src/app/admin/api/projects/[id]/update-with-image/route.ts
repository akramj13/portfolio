import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminAuth, createUnauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cdnUploader } from "@/lib/cdn-uploader";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const isAuthorized = await verifyAdminAuth(req);
  if (!isAuthorized) {
    return createUnauthorizedResponse();
  }

  const params = await context.params;

  try {
    // Check if request is FormData (includes image) or JSON
    const contentType = req.headers.get("content-type") || "";

    let projectData;
    let imageFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (with image)
      const formData = await req.formData();
      const projectJson = formData.get("project") as string;
      imageFile = formData.get("image") as File | null;

      if (!projectJson) {
        return NextResponse.json(
          { error: "Project data is required" },
          { status: 400 }
        );
      }

      projectData = JSON.parse(projectJson);
    } else {
      // Handle JSON (without image)
      projectData = await req.json();
    }

    const {
      title,
      description,
      features,
      time,
      tags,
      highlights,
      challenges,
      link,
    } = projectData;

    // Validate required fields
    if (!title || !description || !link) {
      return NextResponse.json(
        { error: "Title, description, and link are required" },
        { status: 400 }
      );
    }

    // Handle image file if provided
    let imageSrc: string | null = null;
    if (imageFile) {
      // Upload to CDN volume
      const fileName = `${Date.now()}-${imageFile.name}`;

      // Upload to CDN and get the URL
      imageSrc = await cdnUploader.uploadFile(imageFile, fileName);
    }

    // Prepare update data - only include src if a new image was uploaded
    const updateData = {
      title,
      description,
      features: features || [],
      time: time || "",
      tags: tags || [],
      highlights: highlights || [],
      challenges: challenges || [],
      link,
      ...(imageSrc && { src: imageSrc }),
    };

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
    });

    // Revalidate the projects page to reflect changes
    revalidatePath("/projects");

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

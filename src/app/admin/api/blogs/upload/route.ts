import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdminAuth, createUnauthorizedResponse } from "@/lib/auth";
import { cdnUploader } from "@/lib/cdn-uploader";
import JSZip from "jszip";
import { execSync } from "child_process";
import { BlogInput } from "@/types";

export async function POST(req: NextRequest) {
  console.log("Blog upload request received"); // Debug log

  // Verify admin authentication
  const isAuthorized = await verifyAdminAuth(req);
  if (!isAuthorized) {
    return createUnauthorizedResponse();
  }

  try {
    const formData = await req.formData();
    const zipFile = formData.get("zipFile") as File;
    const blogDataJson = formData.get("blogData") as string;
    const editMode = formData.get("editMode") === "true";

    // In create mode, zip file is required. In edit mode, it's optional.
    if (!blogDataJson || (!editMode && !zipFile)) {
      return NextResponse.json(
        {
          error: editMode
            ? "Blog data is required"
            : "Zip file and blog data are required",
        },
        { status: 400 }
      );
    }

    console.log(
      "Processing zip file:",
      zipFile?.name || "No zip file provided"
    );

    const blogData: BlogInput = JSON.parse(blogDataJson);
    const { title, slug, excerpt, readingTime, tags, published } = blogData;
    const existingBlogId = formData.get("existingBlogId");

    // Validate required fields
    if (!title || !slug || !excerpt) {
      return NextResponse.json(
        { error: "Title, slug, and excerpt are required" },
        { status: 400 }
      );
    }

    // For edit mode, fetch the existing blog by ID first
    let existingBlog = null;
    if (editMode && existingBlogId) {
      existingBlog = await prisma.blog.findUnique({
        where: { id: parseInt(existingBlogId.toString()) },
      });

      if (!existingBlog) {
        return NextResponse.json(
          { error: "Blog not found for editing" },
          { status: 404 }
        );
      }
    }

    // Check if slug already exists (exclude current blog being edited)
    const blogWithSameSlug = await prisma.blog.findUnique({
      where: { slug },
    });

    if (blogWithSameSlug) {
      // If we found a blog with this slug, make sure it's not the one we're editing
      if (
        !editMode ||
        (existingBlog && blogWithSameSlug.id !== existingBlog.id)
      ) {
        return NextResponse.json(
          { error: "A blog with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // If editing, delete old images from CDN (only if new zip file is provided)
    // Use the ORIGINAL blog's slug for CDN cleanup, not the new slug
    if (editMode && existingBlog && zipFile) {
      try {
        console.log("Deleting old blog files for:", existingBlog.slug);
        // Delete the entire blog folder from CDN using the original slug
        execSync(
          `docker exec portfolio-cdn rm -rf /usr/share/nginx/html/blogs/${existingBlog.slug}`
        );
      } catch (error) {
        console.warn("Failed to delete old blog files:", error);
        // Continue anyway, new files will overwrite
      }
    }

    let processedMarkdown = "";

    // Process the zip file only if one is provided
    if (zipFile) {
      // Process the zip file
      const zipBuffer = await zipFile.arrayBuffer();
      const zip = new JSZip();
      const zipContents = await zip.loadAsync(zipBuffer);

      let markdownContent = "";
      const imageUploads: Promise<string>[] = [];
      const imageMap: { [originalPath: string]: string } = {};

      // Process each file in the zip
      for (const [relativePath, file] of Object.entries(zipContents.files)) {
        if (file.dir) continue; // Skip directories

        const fileName = relativePath.split("/").pop() || "";

        if (fileName.endsWith(".md")) {
          // Extract markdown content
          markdownContent = await file.async("text");
          console.log("Found markdown file:", fileName);
        } else if (fileName.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
          // Handle image files
          console.log("Processing image:", fileName);
          const imageBuffer = await file.async("arraybuffer");
          const imageFile = new File([imageBuffer], fileName, {
            type: getImageMimeType(fileName),
          });

          // Upload to CDN in blogs folder
          const cdnFileName = `blogs/${slug}/${fileName}`;
          const uploadPromise = cdnUploader
            .uploadFile(imageFile, cdnFileName)
            .then((cdnUrl) => {
              imageMap[relativePath] = cdnUrl;
              imageMap[fileName] = cdnUrl; // Also map just the filename
              return cdnUrl;
            });
          imageUploads.push(uploadPromise);
        }
      }

      // Wait for all image uploads to complete
      await Promise.all(imageUploads);
      console.log("Image uploads completed:", imageMap);

      // Replace image references in markdown
      processedMarkdown = markdownContent;
      for (const [originalPath, cdnUrl] of Object.entries(imageMap)) {
        // Replace various possible image reference formats
        const filename = originalPath.split("/").pop() || originalPath;

        const patterns = [
          // Match ![alt](./filename.ext)
          new RegExp(
            `!\\[([^\\]]*)\\]\\(\\./${escapeRegExp(filename)}\\)`,
            "g"
          ),
          // Match ![alt](filename.ext)
          new RegExp(`!\\[([^\\]]*)\\]\\(${escapeRegExp(filename)}\\)`, "g"),
          // Match ![alt](originalPath) for full paths
          new RegExp(
            `!\\[([^\\]]*)\\]\\(${escapeRegExp(originalPath)}\\)`,
            "g"
          ),
          // Match HTML img tags
          new RegExp(
            `<img[^>]*src=["']${escapeRegExp(originalPath)}["'][^>]*>`,
            "g"
          ),
          new RegExp(
            `<img[^>]*src=["']\\./${escapeRegExp(filename)}["'][^>]*>`,
            "g"
          ),
        ];

        patterns.forEach((pattern) => {
          processedMarkdown = processedMarkdown.replace(
            pattern,
            (match, alt) => {
              if (match.startsWith("![")) {
                return `![${alt || ""}](${cdnUrl})`;
              } else {
                return match.replace(/src=["'][^"']*["']/, `src="${cdnUrl}"`);
              }
            }
          );
        });
      }

      console.log(
        "Processed markdown content length:",
        processedMarkdown.length
      );

      if (!markdownContent) {
        return NextResponse.json(
          { error: "No markdown file found in zip" },
          { status: 400 }
        );
      }
    }

    // For edit mode without zip file, get existing content
    if (editMode && !zipFile && existingBlog) {
      processedMarkdown = existingBlog.content;
      console.log("Using existing blog content for metadata-only update");
    }

    // Create or update blog post in database
    const blog =
      editMode && existingBlog
        ? await prisma.blog.update({
            where: { id: existingBlog.id },
            data: {
              title,
              slug,
              readingTime: readingTime || 5,
              excerpt,
              tags: tags || [],
              content: processedMarkdown,
              published: published || false,
              updatedAt: new Date(),
            },
          })
        : await prisma.blog.create({
            data: {
              title,
              slug,
              date: new Date(),
              readingTime: readingTime || 5,
              excerpt,
              tags: tags || [],
              content: processedMarkdown,
              published: published || false,
            },
          });

    console.log(
      `Blog ${editMode ? "updated" : "created"} successfully:`,
      blog.id
    );

    // Revalidate pages to update static content
    revalidatePath("/writing");
    revalidatePath(`/writing/${blog.slug}`);

    // If editing and slug changed, also revalidate the old slug path
    if (editMode && existingBlog && existingBlog.slug !== blog.slug) {
      revalidatePath(`/writing/${existingBlog.slug}`);
      console.log(
        `Also revalidated old slug path: /writing/${existingBlog.slug}`
      );
    }

    console.log(`Revalidated paths for blog: ${blog.slug}`);

    return NextResponse.json(blog, { status: editMode ? 200 : 201 });
  } catch (error) {
    console.error("Error processing blog upload:", error);
    return NextResponse.json(
      {
        error: "Failed to process blog upload",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function getImageMimeType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/jpeg";
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

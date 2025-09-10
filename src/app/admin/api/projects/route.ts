import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminAuth, createUnauthorizedResponse } from "@/lib/auth";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" }, // Order by sortOrder
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Verify admin authentication
  const isAuthorized = await verifyAdminAuth(req);
  if (!isAuthorized) {
    return createUnauthorizedResponse();
  }

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

    // Get the maximum sortOrder to place new project at the end
    const maxSortOrder = await prisma.project.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    // Prepare project data
    const projectCreateData = {
      title,
      description,
      features: features || [],
      time: time || "",
      tags: tags || [],
      highlights: highlights || [],
      challenges: challenges || [],
      link,
      sortOrder: (maxSortOrder?.sortOrder ?? -1) + 1,
      // Include image data if provided
      ...(imageFile && {
        imageBytes: Buffer.from(await imageFile.arrayBuffer()),
        imageMime: imageFile.type,
      }),
    };

    const project = await prisma.project.create({
      data: projectCreateData,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

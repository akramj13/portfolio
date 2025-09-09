import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      features,
      time,
      tags,
      highlights,
      challenges,
      link,
    } = body;

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

    const project = await prisma.project.create({
      data: {
        title,
        description,
        features: features || [],
        time: time || "",
        tags: tags || [],
        highlights: highlights || [],
        challenges: challenges || [],
        link,
        sortOrder: (maxSortOrder?.sortOrder ?? -1) + 1,
        // imageBytes and imageMime will be null initially
        // They can be updated later via the image upload endpoint
      },
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

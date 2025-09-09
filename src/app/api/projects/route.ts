import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" }, // Order by sortOrder
    });

    // Transform projects to include src field for image
    const transformedProjects = projects.map((project) => ({
      ...project,
      // Only use database image if it exists
      src: project.imageBytes
        ? `/admin/api/projects/${project.id}/image`
        : null,
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminAuth, createUnauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(
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
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

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
      src,
    } = body;

    // Validate required fields
    if (!title || !description || !link) {
      return NextResponse.json(
        { error: "Title, description, and link are required" },
        { status: 400 }
      );
    }

    const updateData = {
      title,
      description,
      features: features || [],
      time: time || "",
      tags: tags || [],
      highlights: highlights || [],
      challenges: challenges || [],
      link,
      ...(src && { src }),
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

export async function DELETE(
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
    await prisma.project.delete({
      where: { id: params.id },
    });

    // Revalidate the projects page to reflect changes
    revalidatePath("/projects");
    revalidatePath("/"); // Also revalidate home page in case projects are shown there

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

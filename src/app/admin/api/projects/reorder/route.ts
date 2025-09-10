import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminAuth, createUnauthorizedResponse } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  // Verify admin authentication
  const isAuthorized = await verifyAdminAuth(req);
  if (!isAuthorized) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await req.json();
    const { projectIds } = body;

    if (!Array.isArray(projectIds)) {
      return NextResponse.json(
        { error: "projectIds must be an array" },
        { status: 400 }
      );
    }

    // Update sortOrder for each project based on its position in the array
    const updatePromises = projectIds.map((id: string, index: number) =>
      prisma.project.update({
        where: { id },
        data: { sortOrder: index },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering projects:", error);
    return NextResponse.json(
      { error: "Failed to reorder projects" },
      { status: 500 }
    );
  }
}

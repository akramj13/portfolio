import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminAuth, createUnauthorizedResponse } from "@/lib/auth";

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
    const buf = Buffer.from(await req.arrayBuffer());
    // optional: run through sharp here to cap dimensions/quality
    await prisma.project.update({
      where: { id: params.id },
      data: {
        imageBytes: buf,
        imageMime: req.headers.get("content-type") ?? "image/webp",
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

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
    const proj = await prisma.project.findUnique({
      where: { id: params.id },
      select: { imageBytes: true, imageMime: true, title: true },
    });

    if (!proj) {
      return new NextResponse("Project not found", { status: 404 });
    }

    if (!proj.imageBytes) {
      // Return a redirect to a placeholder image instead of 404
      return Response.redirect("/projects/placeholder.png", 302);
    }

    const res = new NextResponse(Buffer.from(proj.imageBytes), {
      headers: {
        "Content-Type": proj.imageMime ?? "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
    return res;
  } catch (error) {
    console.error("Error fetching project image:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

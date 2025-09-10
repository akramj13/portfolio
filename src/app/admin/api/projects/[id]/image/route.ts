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
  // Note: No authentication required for GET - images should be publicly accessible

  const params = await context.params;

  try {
    const proj = await prisma.project.findUnique({
      where: { id: params.id },
      select: { imageBytes: true, imageMime: true, title: true },
    });

    console.log(`Image request for project ${params.id}:`, {
      projectFound: !!proj,
      hasImageBytes: !!proj?.imageBytes,
      imageBytesLength: proj?.imageBytes?.length || 0,
      imageMime: proj?.imageMime,
    });

    if (!proj) {
      return new NextResponse("Project not found", { status: 404 });
    }

    if (!proj.imageBytes || proj.imageBytes.length === 0) {
      // Return a redirect to a placeholder image instead of 404
      return NextResponse.redirect(new URL("/placeholder.svg", req.url));
    }

    // Ensure imageBytes is properly converted to Buffer
    const imageBuffer =
      proj.imageBytes instanceof Buffer
        ? proj.imageBytes
        : Buffer.from(proj.imageBytes);

    const res = new NextResponse(imageBuffer, {
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

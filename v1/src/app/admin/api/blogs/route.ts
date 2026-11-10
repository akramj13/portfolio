import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdminAuth, createUnauthorizedResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published");

    const whereClause = published === "true" ? { published: true } : {};

    const blogs = await prisma.blog.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // Verify admin authentication
  const isAuthorized = await verifyAdminAuth(req);
  if (!isAuthorized) {
    return createUnauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const deletedBlog = await prisma.blog.delete({
      where: { id: parseInt(id) },
    });

    // Revalidate pages to update static content
    revalidatePath("/writing");
    revalidatePath(`/writing/${deletedBlog.slug}`);

    console.log(`Revalidated paths after deleting blog: ${deletedBlog.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  // Verify admin authentication
  const isAuthorized = await verifyAdminAuth(req);
  if (!isAuthorized) {
    return createUnauthorizedResponse();
  }

  try {
    const { id, published } = await req.json();

    if (!id || typeof published !== "boolean") {
      return NextResponse.json(
        { error: "Blog ID and published status are required" },
        { status: 400 }
      );
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: { published },
    });

    // Revalidate pages to update static content
    revalidatePath("/writing");
    revalidatePath(`/writing/${updatedBlog.slug}`);

    console.log(
      `Revalidated paths after ${
        published ? "publishing" : "unpublishing"
      } blog: ${updatedBlog.slug}`
    );

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        date: true,
        readingTime: true,
        excerpt: true,
        tags: true,
        published: true,
      },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

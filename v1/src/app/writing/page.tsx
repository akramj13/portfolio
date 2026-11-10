import React from "react";
import prisma from "@/lib/prisma";
import WritingClient from "@/components/utils/writing-client";

// Use ISR with on-demand revalidation instead of disabling cache completely
export const revalidate = 3600; // Revalidate every hour, but can be triggered on-demand

async function getPublishedBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return blogs;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

async function Writing() {
  const blogs = await getPublishedBlogs();

  return <WritingClient blogs={blogs} />;
}

export default Writing;

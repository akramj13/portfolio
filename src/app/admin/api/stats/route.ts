import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [projectCount] = await Promise.all([
      prisma.project.count(),
      // Add more stats here as needed
    ]);

    return NextResponse.json({
      projects: projectCount,
      blogPosts: 8, // Placeholder until blog functionality is implemented
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

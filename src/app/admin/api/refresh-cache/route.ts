// app/api/admin/refresh-cache/route.ts (Next.js 14/15)
// Protect this route (check session/role) before running!
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdminAuth, createUnauthorizedResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Verify admin authentication
  const isAuthorized = await verifyAdminAuth(req);
  if (!isAuthorized) {
    return createUnauthorizedResponse();
  }

  try {
    // 1) Call your Python FastAPI service to get LinkedIn experience data
    const fastApiUrl = process.env.LINKEDIN_DATA_URL || "http://localhost:8000";
    const response = await fetch(`${fastApiUrl}/experience`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LINKEDIN_TOKEN && {
          Authorization: `Bearer ${process.env.LINKEDIN_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(
        `FastAPI request failed: ${response.status} ${response.statusText}`
      );
    }

    const payload = await response.json();

    // 2) Persist/overwrite cache in database
    await prisma.linkedInCache.upsert({
      where: { id: "main" }, // Using "main" as per your schema default
      update: { payload },
      create: { id: "main", payload },
    });

    // 3) Revalidate the home page to reflect the new data
    revalidatePath("/");

    return NextResponse.json({
      ok: true,
      message: "LinkedIn experience data refreshed successfully",
      experienceCount: Array.isArray(payload) ? payload.length : 0,
    });
  } catch (error) {
    console.error("Error refreshing LinkedIn cache:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to refresh LinkedIn experience data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import React from "react";
import { PrismaClient } from "../../generated/prisma";
import WorkExperienceClient from "@/components/utils/experience-client";
import { Experience } from "@/types";

const prisma = new PrismaClient();

async function WorkExperience() {
  try {
    // Fetch experiences from Prisma cache
    const linkedInCache = await prisma.linkedInCache.findUnique({
      where: { id: "main" },
    });

    // Extract experiences from the cached payload
    const experiences = (linkedInCache?.payload as Experience[]) || [];

    return <WorkExperienceClient experiences={experiences} />;
  } catch (error) {
    console.error("Failed to fetch work experiences:", error);

    // Fallback to empty array or static data
    return <WorkExperienceClient experiences={[]} />;
  } finally {
    await prisma.$disconnect();
  }
}

export default WorkExperience;

import React from "react";
import { PrismaClient } from "../../generated/prisma";
import WorkExperienceClient from "@/components/utils/experience-client";
import { Experience } from "@/types";

const prisma = new PrismaClient();

async function getExperiences(): Promise<Experience[]> {
  try {
    // Fetch experiences from Prisma cache
    const linkedInCache = await prisma.linkedInCache.findUnique({
      where: { id: "main" },
    });

    // Extract experiences from the cached payload
    return (linkedInCache?.payload as Experience[]) || [];
  } catch (error) {
    console.error("Failed to fetch work experiences:", error);

    // Fallback to empty array or static data
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

async function WorkExperience() {
  const experiences = await getExperiences();

  return <WorkExperienceClient experiences={experiences} />;
}

export default WorkExperience;

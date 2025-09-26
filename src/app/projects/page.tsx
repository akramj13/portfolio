import React from "react";
import { PrismaClient } from "../../../generated/prisma";
import ProjectsClient from "@/components/utils/projects-client";

const prisma = new PrismaClient();

// Enable revalidation for this page when projects are updated
export const revalidate = 0; // Disable static generation caching for ISR

async function Projects() {
  try {
    // Fetch projects from database at build time
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return <ProjectsClient projects={projects} />;
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    // Fallback to empty array
    return <ProjectsClient projects={[]} />;
  } finally {
    await prisma.$disconnect();
  }
}

export default Projects;

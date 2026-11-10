import React from "react";
import { PrismaClient } from "../../../generated/prisma";
import ProjectsClient from "@/components/utils/projects-client";

const prisma = new PrismaClient();

// Enable ISR with 60 second revalidation instead of on-demand
export const revalidate = 60;

// Enable static params generation
export const dynamic = "force-static";

async function getProjects() {
  try {
    // Fetch projects from database at build time
    return await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    // Fallback to empty array
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

async function Projects() {
  const projects = await getProjects();

  return <ProjectsClient projects={projects} />;
}

export default Projects;

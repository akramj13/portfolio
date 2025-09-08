import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "desc" }, // Most recent first
    });

    // Transform projects to include src field for image
    const transformedProjects = projects.map((project) => ({
      ...project,
      // Use the original image from JSON if no image in database, or fallback
      src: project.imageBytes
        ? `/admin/api/projects/${project.id}/image`
        : getOriginalImageSrc(project.title),
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// Helper function to map project titles to their original image paths
function getOriginalImageSrc(title: string): string | null {
  const imageMap: Record<string, string> = {
    "AlzGuard - Alzheimer's Detection": "/projects/alzguard.png",
    "Voice Synthesis AI - AI-Powered Voice Generation":
      "/projects/ai-voice.png",
    "LearnETF - Stock Learning Web App": "/projects/learnetf.png",
    "Stock Advisor AI - Investment Prediction Tool":
      "/projects/stockadvisor.png",
    "Portfolio Website": "/projects/portfolio.png",
    // Add more mappings for other projects in the JSON
    "Task Manager": "/projects/task-manager.svg",
    "Weather App": "/projects/weather-app.svg",
    "E-commerce Platform": "/projects/ecommerce.svg",
    "Social Media App": "/projects/social-app.svg",
    "AI Chatbot": "/projects/ai-chatbot.svg",
  };

  return imageMap[title] || "/projects/placeholder.svg"; // fallback to a default image
}

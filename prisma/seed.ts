import { PrismaClient } from "../generated/prisma/index.js";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with projects...");

  // Read projects JSON file
  const projectsPath = path.join(
    process.cwd(),
    "src/app/projects/projects.json"
  );
  const projectsData = JSON.parse(fs.readFileSync(projectsPath, "utf8"));

  // Clear existing projects
  await prisma.project.deleteMany();

  // Insert projects from JSON
  for (const project of projectsData) {
    await prisma.project.create({
      data: {
        title: project.title,
        description: project.description,
        features: project.features,
        time: project.time,
        tags: project.tags,
        highlights: project.highlights,
        challenges: project.challenges,
        link: project.link,
      },
    });
  }

  console.log(`Seeded ${projectsData.length} projects successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageMime" TEXT,
    "imageBytes" BYTEA,
    "features" TEXT[],
    "time" TEXT NOT NULL,
    "tags" TEXT[],
    "highlights" TEXT[],
    "challenges" TEXT[],
    "link" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

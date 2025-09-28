-- CreateTable
CREATE TABLE "public"."LinkedInCache" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkedInCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "src" TEXT,
    "features" TEXT[],
    "time" TEXT NOT NULL,
    "tags" TEXT[],
    "highlights" TEXT[],
    "challenges" TEXT[],
    "link" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Blog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "readingTime" INTEGER NOT NULL,
    "excerpt" TEXT NOT NULL,
    "tags" TEXT[],
    "content" TEXT NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

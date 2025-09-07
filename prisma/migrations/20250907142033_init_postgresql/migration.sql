-- CreateTable
CREATE TABLE "public"."LinkedInCache" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkedInCache_pkey" PRIMARY KEY ("id")
);

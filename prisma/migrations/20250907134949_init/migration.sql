-- CreateTable
CREATE TABLE "LinkedInCache" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "payload" JSONB NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

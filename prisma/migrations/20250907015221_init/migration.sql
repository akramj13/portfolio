-- CreateTable
CREATE TABLE "LinkedInCache" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'linkedin_experience',
    "payload" JSONB NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

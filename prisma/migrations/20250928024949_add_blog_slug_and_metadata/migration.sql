/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/

-- First, add new columns with temporary defaults
ALTER TABLE "public"."Blog" 
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "slug" TEXT NOT NULL DEFAULT '',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing records with generated slugs (if any exist)
UPDATE "public"."Blog" 
SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("title", '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE "slug" = '';

-- Update updatedAt to match createdAt for existing records
UPDATE "public"."Blog" 
SET "updatedAt" = "createdAt"
WHERE "updatedAt" = "createdAt";

-- Create the unique index
CREATE UNIQUE INDEX "Blog_slug_key" ON "public"."Blog"("slug");

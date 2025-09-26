/*
  Warnings:

  - You are about to drop the column `imageBytes` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `imageMime` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "imageBytes",
DROP COLUMN "imageMime",
ADD COLUMN     "src" TEXT;

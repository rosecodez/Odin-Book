/*
  Warnings:

  - Changed the type of `post_image` on the `post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "post_image",
ADD COLUMN     "post_image" JSONB NOT NULL;

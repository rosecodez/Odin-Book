-- AlterTable
ALTER TABLE "message" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "post" ALTER COLUMN "post_image" DROP NOT NULL,
ALTER COLUMN "post_image" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "googleId" TEXT;

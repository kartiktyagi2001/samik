/*
  Warnings:

  - You are about to drop the column `apiGroupId` on the `ApiSource` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ApiSource` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `ApiSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ApiSource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ApiSource" DROP CONSTRAINT "ApiSource_apiGroupId_fkey";

-- AlterTable
ALTER TABLE "public"."ApiGroup" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."ApiSource" DROP COLUMN "apiGroupId",
DROP COLUMN "description",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "headers" JSONB,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "queryParams" JSONB,
ADD COLUMN     "timeout" INTEGER NOT NULL DEFAULT 30000,
ALTER COLUMN "method" SET DEFAULT 'GET';

-- AddForeignKey
ALTER TABLE "public"."ApiSource" ADD CONSTRAINT "ApiSource_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ApiGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

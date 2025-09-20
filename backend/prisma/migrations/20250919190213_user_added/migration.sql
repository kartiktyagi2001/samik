/*
  Warnings:

  - A unique constraint covering the columns `[authId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ApiGroup" ADD COLUMN     "authorId" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "authId" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "public"."User"("authId");

-- AddForeignKey
ALTER TABLE "public"."ApiGroup" ADD CONSTRAINT "ApiGroup_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("authId") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `Endpoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Endpoint" DROP CONSTRAINT "Endpoint_apiGroupId_fkey";

-- DropTable
DROP TABLE "public"."Endpoint";

-- CreateTable
CREATE TABLE "public"."ApiSource" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "description" TEXT,
    "apiGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiSource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ApiSource" ADD CONSTRAINT "ApiSource_apiGroupId_fkey" FOREIGN KEY ("apiGroupId") REFERENCES "public"."ApiGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

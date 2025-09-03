/*
  Warnings:

  - The `method` column on the `ApiSource` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'DELETE');

-- AlterTable
ALTER TABLE "public"."ApiSource" DROP COLUMN "method",
ADD COLUMN     "method" "public"."HttpMethod" NOT NULL DEFAULT 'GET';

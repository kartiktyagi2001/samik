/*
  Warnings:

  - The `method` column on the `DemoApiSource` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."DemoApiSource" DROP COLUMN "method",
ADD COLUMN     "method" "public"."HttpMethod" NOT NULL DEFAULT 'GET';

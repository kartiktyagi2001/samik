-- AlterTable
ALTER TABLE "public"."DemoApiSource" ADD COLUMN     "headers" JSONB,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "queryParams" JSONB;

-- CreateTable
CREATE TABLE "public"."DemoGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DemoApiSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "timeout" INTEGER NOT NULL DEFAULT 30000,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoApiSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DemoRequest" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "params" JSONB,
    "response" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "DemoRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DemoApiSource" ADD CONSTRAINT "DemoApiSource_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."DemoGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DemoRequest" ADD CONSTRAINT "DemoRequest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."DemoGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

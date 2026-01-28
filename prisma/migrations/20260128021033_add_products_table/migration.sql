-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('SUBSCRIPTION', 'CREDITS');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "credits" INTEGER,
    "bonus" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

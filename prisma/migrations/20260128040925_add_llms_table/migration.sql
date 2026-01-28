-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "llm_id" TEXT;

-- CreateTable
CREATE TABLE "llms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "max_tokens" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_llm_id_fkey" FOREIGN KEY ("llm_id") REFERENCES "llms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

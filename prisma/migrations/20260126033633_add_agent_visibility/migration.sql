-- CreateEnum
CREATE TYPE "AgentVisibility" AS ENUM ('PRIVATE', 'PREMIUM', 'ADMIN_ONLY');

-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "visibility" "AgentVisibility" NOT NULL DEFAULT 'PRIVATE';

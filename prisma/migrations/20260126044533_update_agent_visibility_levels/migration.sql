/*
  Warnings:

  - The values [PREMIUM] on the enum `AgentVisibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AgentVisibility_new" AS ENUM ('PRIVATE', 'PUBLIC', 'PRO_ONLY', 'CUSTOM_ONLY', 'ADMIN_ONLY');
ALTER TABLE "agents" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "agents" ALTER COLUMN "visibility" TYPE "AgentVisibility_new" USING ("visibility"::text::"AgentVisibility_new");
ALTER TYPE "AgentVisibility" RENAME TO "AgentVisibility_old";
ALTER TYPE "AgentVisibility_new" RENAME TO "AgentVisibility";
DROP TYPE "AgentVisibility_old";
ALTER TABLE "agents" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE';
COMMIT;

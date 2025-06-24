-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_teamId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "teamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

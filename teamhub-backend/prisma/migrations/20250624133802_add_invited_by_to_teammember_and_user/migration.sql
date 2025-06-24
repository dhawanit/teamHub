-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "invitedBy" TEXT;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

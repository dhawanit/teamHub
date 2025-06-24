-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateEnum
CREATE TYPE "OffRampingStatus" AS ENUM ('Processing', 'Approved', 'Rejected');

-- AlterTable
ALTER TABLE "Balance" ALTER COLUMN "currency" SET DEFAULT 'INR';

-- CreateTable
CREATE TABLE "offRamping" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "OffRampingStatus" "OffRampingStatus" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "offRamping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "offRamping_token_key" ON "offRamping"("token");

-- AddForeignKey
ALTER TABLE "offRamping" ADD CONSTRAINT "offRamping_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

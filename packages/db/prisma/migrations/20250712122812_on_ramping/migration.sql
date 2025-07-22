-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'User', 'Merchant');

-- CreateEnum
CREATE TYPE "OnRampingStatus" AS ENUM ('Processing', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "currency" AS ENUM ('USD', 'EUR', 'GBP', 'INR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';

-- CreateTable
CREATE TABLE "OnRamping" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "OnRampingStatus" "OnRampingStatus" NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "OnRamping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" "currency" NOT NULL,
    "locked" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnRamping_user_id_key" ON "OnRamping"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "OnRamping_token_key" ON "OnRamping"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_user_id_key" ON "Balance"("user_id");

-- AddForeignKey
ALTER TABLE "OnRamping" ADD CONSTRAINT "OnRamping_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

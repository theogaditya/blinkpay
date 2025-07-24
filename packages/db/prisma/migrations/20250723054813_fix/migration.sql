/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `OnRamping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OnRamping" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Balance_user_id_key" ON "Balance"("user_id");

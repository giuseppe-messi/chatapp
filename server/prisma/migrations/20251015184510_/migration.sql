/*
  Warnings:

  - A unique constraint covering the columns `[secretHash]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `secretHash` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "secretHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_secretHash_key" ON "Session"("secretHash");

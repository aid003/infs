/*
  Warnings:

  - Added the required column `department` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "salary" INTEGER NOT NULL;

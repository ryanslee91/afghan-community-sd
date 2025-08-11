/*
  Warnings:

  - The `languages` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('DARI', 'PASHTO', 'ENGLISH');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MENTOR';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "languages",
ADD COLUMN     "languages" "Language"[];

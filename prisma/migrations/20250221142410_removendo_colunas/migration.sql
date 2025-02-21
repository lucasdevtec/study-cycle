/*
  Warnings:

  - You are about to drop the column `peso` on the `Materia` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Materia" DROP COLUMN "peso",
ALTER COLUMN "incluso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

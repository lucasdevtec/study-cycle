/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Materias" ADD COLUMN     "horasConcluidas" INTEGER,
ADD COLUMN     "horasTotais" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password";

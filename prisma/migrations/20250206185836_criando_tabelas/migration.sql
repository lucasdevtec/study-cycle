-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "nickname" TEXT,
    "horasCiclo" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "peso" INTEGER NOT NULL,
    "dificuldade" INTEGER NOT NULL,
    "horasTotais" INTEGER,
    "horasConcluidas" INTEGER,
    "idUsuario" INTEGER NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Materia_nome_key" ON "Materia"("nome");

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

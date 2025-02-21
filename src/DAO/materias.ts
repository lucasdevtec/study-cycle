import prisma from "@/lib/prisma";
import { Materia } from "@prisma/client";

async function criarMateria(dados: Materia) {
  return await prisma.materia.create({
    data: { ...dados },
  });
}

async function criarVariasMaterias(dados: Materia[]) {
  return await prisma.materia.createMany({
    data: dados,
  });
}

async function listarMaterias(idUsuario: string) {
  return await prisma.materia.findMany({
    where: { idUsuario: idUsuario },
  });
}

async function deletarMateria(id: number) {
  return await prisma.materia.delete({
    where: { id: id },
  });
}

async function editarMateria(id: number, dados: Materia) {
  return await prisma.materia.update({ where: { id: id }, data: { ...dados } });
}

export default {
  criarMateria,
  listarMaterias,
  deletarMateria,
  editarMateria,
  criarVariasMaterias,
};

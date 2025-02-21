import prisma from '@/lib/prisma';
import { EditDataOfMateria, InitalDataOfMateria } from '../../types/models';

async function criarMateria(dados: InitalDataOfMateria) {
  return await prisma.materia.create({
    data: { ...dados },
  });
}

async function criarVariasMaterias(dados: InitalDataOfMateria[]) {
  return await prisma.materia.createMany({
    data: dados,
  });
}

async function listarMateriasDoUsuario(idUsuario: string) {
  return await prisma.materia.findMany({
    where: { idUsuario: idUsuario },
  });
}

async function deletarMateria(id: number) {
  return await prisma.materia.delete({
    where: { id: id },
  });
}

async function editarMateria(id: number, dados: EditDataOfMateria) {
  return await prisma.materia.update({ where: { id: id }, data: { ...dados } });
}

export default {
  criarMateria,
  listarMateriasDoUsuario,
  deletarMateria,
  editarMateria,
  criarVariasMaterias,
};

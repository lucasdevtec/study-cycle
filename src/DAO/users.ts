import prisma from '@/lib/prisma';
import { EditDataOfUser, InitalDataOfUser } from '../../types/models';

async function criarUser(dados: InitalDataOfUser) {
  return await prisma.user.create({
    data: { ...dados },
    omit: {
      password: true,
      updatedAt: true,
    },
  });
}

async function listarUser(id: string) {
  return await prisma.user.findUnique({
    where: { id: id },
    omit: {
      password: true,
      updatedAt: true,
    },
  });
}

async function listarUserPorEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email: email },
    omit: {
      updatedAt: true,
    },
  });
}

async function deletarUser(id: string) {
  return await prisma.user.delete({
    where: { id: id },
    omit: {
      password: true,
      updatedAt: true,
    },
  });
}

async function editarUser(id: string, dados: EditDataOfUser) {
  return await prisma.user.update({
    where: { id: id },
    data: { ...dados },
    omit: {
      password: true,
      updatedAt: true,
    },
  });
}

const materiaDAO = {
  criarUser,
  listarUser,
  deletarUser,
  listarUserPorEmail,
  editarUser,
};

export default materiaDAO;

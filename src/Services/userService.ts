import { NextResponse } from 'next/server';
import { EditDataOfUser, InitalDataOfUser } from '../../types/models';
import bcrypt from 'bcrypt';
import userDAO from '@/DAO/users';

export async function createUser(data: InitalDataOfUser) {
  try {
    const { email, name, password, horasCiclo } = data;

    const existingUser = await userDAO.listarUserPorEmail(email);
    if (existingUser !== null) {
      return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userDAO.criarUser({
      email,
      password: hashedPassword,
      name,
      horasCiclo,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    throw error;
  }
}

export async function listarUserPorID(id: string) {
  try {
    const user = await userDAO.listarUser(id);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    throw error;
  }
}

export async function editarUser(id: string, dados: EditDataOfUser) {
  try {
    const { email, name, horasCiclo } = dados;
    const editedUser = await userDAO.editarUser(id, { email, name, horasCiclo });
    return NextResponse.json(editedUser, { status: 200 });
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    const deletedUser = await userDAO.deletarUser(id);
    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error) {
    throw error;
  }
}

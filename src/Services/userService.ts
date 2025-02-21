import { NextResponse } from 'next/server';
import { InitalDataOfUser } from '../../types/models';
import bcrypt from 'bcrypt';
import userDAO from '@/DAO/users';

export async function createUserService(data: InitalDataOfUser) {
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
}

import * as userController from '@/Controllers/userController';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Usuário não Authenticado' }, { status: 401 });
    }
    return await userController.listarUserPorID(session.user.id);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: 'Erro interno inesperado!' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Usuário não Authenticado' }, { status: 401 });
    }
    const data = await req.json();
    return await userController.editarUser(data, session.user.id);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: 'Erro interno inesperado!' }, { status: 500 });
  }
}

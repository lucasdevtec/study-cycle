import { createMateriaController } from '@/Controllers/materiaController';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.json({ ok: 'Ola' }, { status: 200 });
    }
    return NextResponse.json({ error: 'Usuário não Authenticado' }, { status: 401 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: 'Erro interno inesperado!' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      const data = await req.json();
      return await createMateriaController({ ...data, idUsuario: session.user.id });
    }
    return NextResponse.json({ error: 'Usuário não Authenticado' }, { status: 401 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: 'Erro interno inesperado!' }, { status: 500 });
  }
}

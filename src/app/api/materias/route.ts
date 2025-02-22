import { createMateriaController } from '@/Controllers/materiaController';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Usuário não Authenticado' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const search = searchParams.get('search');

    return NextResponse.json({ ok: true, search, query }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Erro desconhecido', error);
    }
    return NextResponse.json({ error: 'Erro interno inesperado!' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Usuário não Authenticado' }, { status: 401 });
    }
    const data = await req.json();
    return await createMateriaController({ ...data, idUsuario: session.user.id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Erro desconhecido', error);
    }
    return NextResponse.json({ error: 'Erro interno inesperado!' }, { status: 500 });
  }
}

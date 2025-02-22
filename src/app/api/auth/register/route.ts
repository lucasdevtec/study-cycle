import { NextResponse } from 'next/server';
import { createUser } from '@/Controllers/userController';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    return await createUser(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Erro desconhecido', error);
    }
    return NextResponse.json({ error: 'Erro interno inesperado!' }, { status: 500 });
  }
}

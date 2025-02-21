import { NextResponse } from 'next/server';
import { createUserController } from '@/Controllers/userController';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    return await createUserController(data);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: 'Erro interno inesperado!' }, { status: 500 });
  }
}

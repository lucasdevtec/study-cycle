import { NextResponse } from 'next/server';
import { InitalDataOfMateria } from '../../types/models';
import materiaDAO from '@/DAO/materias';

export async function createMateriaService(data: InitalDataOfMateria) {
  const { nome, dificuldade, idUsuario } = data;

  const materia = await materiaDAO.criarMateria({ nome, dificuldade, idUsuario });

  return NextResponse.json(materia, { status: 201 });
}

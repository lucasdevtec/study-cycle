import { NextResponse } from 'next/server';
import { InitalDataOfMateria } from '../../types/models';
import materiaDAO from '@/DAO/materias';

export async function createMateriaService(data: InitalDataOfMateria) {
  const { dificuldade, nome, idUsuario, horasTotais, horasConcluidas, incluso } = data;

  const materia = await materiaDAO.criarMateria({ dificuldade, nome, idUsuario, horasTotais, horasConcluidas, incluso });

  return NextResponse.json(materia, { status: 201 });
}

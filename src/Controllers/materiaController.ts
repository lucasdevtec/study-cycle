import { NextResponse } from 'next/server';
import { InitalDataOfMateria } from '../../types/models';
import * as isValid from '@/schemas/materiaSchema';
import * as service from '@/Services/materiaService';

export async function createMateriaController(data: InitalDataOfMateria) {
  try {
    const parsedData = isValid.createMateria.safeParse(data);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors[0].message }, { status: 400 });
    }
    return await service.createMateriaService(parsedData.data);
  } catch (error) {
    throw error;
  }
}

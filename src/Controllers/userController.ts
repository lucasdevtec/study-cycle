import { NextResponse } from 'next/server';
import { EditDataOfUser, InitalDataOfUser } from '../../types/models';
import * as userSchema from '@/schemas/userSchema';
import * as basicSchema from '@/schemas/basicShema';
import * as service from '@/Services/userService';

export async function createUser(data: InitalDataOfUser) {
  try {
    const parsedData = userSchema.registerSchema.safeParse(data);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors[0].message }, { status: 400 });
    }
    return await service.createUser(parsedData.data);
  } catch (error) {
    throw error;
  }
}

export async function listarUserPorID(id: string) {
  try {
    const parsedData = basicSchema.stringSchema.safeParse(id);
    if (!parsedData.success) {
      return NextResponse.json({ error: 'Tipo esperado invalido' }, { status: 400 });
    }
    return await service.listarUserPorID(parsedData.data);
  } catch (error) {
    throw error;
  }
}

export async function editarUser(data: EditDataOfUser, idUsuario: string) {
  try {
    const parsedId = basicSchema.stringSchema.safeParse(idUsuario);
    if (!parsedId.success) {
      return NextResponse.json({ error: 'Tipo esperado invalido' }, { status: 400 });
    }
    const parsedData = userSchema.editSchema.safeParse(data);
    if (!parsedData.success) {
      return NextResponse.json({ error: 'Tipo esperado invalido' }, { status: 400 });
    }
    return await service.editarUser(parsedId.data, parsedData.data);
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(idUsuario: string) {
  try {
    const parsedId = basicSchema.stringSchema.safeParse(idUsuario);
    if (!parsedId.success) {
      return NextResponse.json({ error: 'Tipo esperado invalido' }, { status: 400 });
    }

    return await service.deleteUser(parsedId.data);
  } catch (error) {
    throw error;
  }
}

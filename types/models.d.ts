export interface InitalDataOfUser {
  email: string;
  name: string;
  password: string;
  horasCiclo?: number;
}

export interface EditDataOfUser {
  email?: string;
  name?: string;
  password?: string;
  horasCiclo?: number;
}

export interface FullDataOfMateria {
  id: number;
  nome: string;
  dificuldade: number;
  horasTotais: number | null;
  horasConcluidas: number | null;
  incluso: boolean;
  idUsuario: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface EditDataOfMateria {
  nome?: string;
  dificuldade?: number;
  horasTotais?: number | null;
  horasConcluidas?: number | null;
  incluso?: boolean;
}

export interface InitalDataOfMateria {
  nome: string;
  dificuldade: number;
  horasTotais?: number | null;
  horasConcluidas?: number | null;
  idUsuario: string;
  incluso?: boolean;
}

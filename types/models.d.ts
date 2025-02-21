export interface InitalDataOfUser {
  email: string;
  name?: string | undefined;
  password: string;
  horasCiclo?: number | undefined;
}

export interface EditDataOfUser {
  email?: string;
  name?: string;
  password?: string;
  horasCiclo?: number;
}

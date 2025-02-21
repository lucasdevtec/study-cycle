// types/next-auth.d.ts

import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

// Extende a interface `User` para adicionar `horasCiclo`
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string | null;
    horasCiclo?: number; // Campo opcional
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string | null;
      horasCiclo?: number; // Campo opcional
    };
  }
}

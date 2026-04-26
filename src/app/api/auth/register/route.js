import bcrypt from "bcryptjs";

import { findUserByEmail, createUser } from "@/database/repositories/authRepo";

export async function POST(req) {
	try {
		const { name, email, password } = await req.json();

		if (!name || !email || !password) {
			return Response.json({ message: "Nome, email e senha são obrigatórios" }, { status: 400 });
		}

		if (password.length < 8) {
			return Response.json({ message: "Senha deve ter no mínimo 8 caracteres" }, { status: 400 });
		}

		const existing = await findUserByEmail(email);
		if (existing) {
			return Response.json({ message: "Email já cadastrado" }, { status: 400 });
		}

		const hashed = await bcrypt.hash(password, 10);
		const user = await createUser({ name, email, password: hashed });

		return Response.json({ user }, { status: 201 });
	} catch (err) {
		console.error("Registration error:", err);
		return Response.json({ message: "Erro ao criar usuário" }, { status: 500 });
	}
}

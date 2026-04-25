import { getDbModels } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
	try {
		const { name, email, password } = await request.json();

		if (!name || !email || !password) {
			return Response.json({ message: "Nome, email e senha são obrigatórios" }, { status: 400 });
		}

		if (password.length < 8) {
			return Response.json({ message: "Senha deve ter no mínimo 8 caracteres" }, { status: 400 });
		}

		const { User } = await getDbModels();

		const existingUser = await User.findOne({
			where: { email },
		});

		if (existingUser) {
			return Response.json({ message: "Email já cadastrado" }, { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		return Response.json(
			{
				message: "Usuário criado com sucesso",
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Registration error:", error);
		return Response.json({ message: "Erro ao criar usuário" }, { status: 500 });
	}
}

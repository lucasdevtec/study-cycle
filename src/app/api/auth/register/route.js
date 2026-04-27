import { authService } from "@/lib/modules/auth/auth.service";

export async function POST(req) {
	try {
		const body = await req.json();

		const user = await authService.register(body);

		return Response.json({ message: "Usuário criado com sucesso", user }, { status: 201 });
	} catch (err) {
		if (err.name === "ZodError") {
			const message = err.errors[0]?.message || "Dados inválidos";
			return Response.json({ message }, { status: 400 });
		}

		if (err.message === "Email já cadastrado") {
			return Response.json({ message: err.message }, { status: 409 });
		}

		console.error("Registration error:", err);
		return Response.json({ message: "Erro interno ao criar usuário" }, { status: 500 });
	}
}

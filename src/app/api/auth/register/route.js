import { authService } from "@/lib/modules/auth/auth.service";
import HandleError from "@/utils/handleErrors";

export async function POST(req) {
	try {
		const body = await req.json();

		const user = await authService.register(body);

		return Response.json({ message: "Usuário criado com sucesso", user }, { status: 201 });
	} catch (err) {
		return HandleError(err, "Erro interno ao criar usuário");
	}
}

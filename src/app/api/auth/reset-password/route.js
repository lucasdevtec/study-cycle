import { NextResponse } from "next/server";
import { authService } from "@/lib/modules/auth/auth.service";
import HandleError from "@/utils/handleErrors";

export async function POST(req) {
	try {
		const body = await req.json();
		await authService.resetPassword(body);

		return NextResponse.json({
			message: "Senha redefinida com sucesso.",
		});
	} catch (err) {
		return HandleError(err, "Erro ao redefinir senha", null, {
			"Token inválido": 400,
			"Token inválido ou expirado": 400,
		});
	}
}

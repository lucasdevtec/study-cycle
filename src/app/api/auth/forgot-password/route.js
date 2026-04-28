import { NextResponse } from "next/server";
import { authService } from "@/lib/modules/auth/auth.service";
import HandleError from "@/utils/handleErrors";

export async function POST(req) {
	try {
		const body = await req.json();
		await authService.forgotPassword(body);

		return NextResponse.json({
			message: "Se existir uma conta com este email, enviaremos um link para redefinir sua senha.",
		});
	} catch (err) {
		return HandleError(err, "Erro ao solicitar redefinição de senha");
	}
}

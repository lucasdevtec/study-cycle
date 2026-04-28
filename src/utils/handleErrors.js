import { NextResponse } from "next/server";
import { formatZodError } from "@/utils/zodErrors";

const defaultErrorStatusMap = {
	Unauthorized: 401,
	"Acesso negado": 403,
	"Email já cadastrado": 409,
	"Credenciais inválidas": 401,
	"Esta conta utiliza login social. Entre com o Google.": 401,
};

export default function HandleError(err, fallbackMessage, notFoundMessage, customErrorStatusMap = {}) {
	if (err?.name === "ZodError") {
		return NextResponse.json(
			{
				type: "validation",
				errors: formatZodError(err),
			},
			{ status: 400 },
		);
	}

	if (notFoundMessage && err?.message === notFoundMessage) {
		return NextResponse.json({ message: err.message }, { status: 404 });
	}

	const mappedStatus = customErrorStatusMap[err?.message] || defaultErrorStatusMap[err?.message];

	if (mappedStatus) {
		return NextResponse.json({ message: err.message }, { status: mappedStatus });
	}

	return NextResponse.json({ message: err?.message || fallbackMessage }, { status: 500 });
}

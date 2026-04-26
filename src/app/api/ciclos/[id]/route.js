import { NextResponse } from "next/server";
import { cycleService } from "@/lib/modules/cycle/cycle.service";
import { formatZodError } from "@/utils/zodErrors";
import { createCycleSchema, cycleIdSchema } from "@/lib/modules/cycle/cycle.schema";

function parseId(params) {
	const { success, data } = cycleIdSchema.safeParse(params?.id);
	return success ? data : null;
}

function handleError(err, fallbackMessage, notFoundMessage) {
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

	return NextResponse.json({ message: err?.message || fallbackMessage }, { status: 500 });
}

export async function GET(_req, { params }) {
	try {
		const cycleId = parseId(params);

		if (!cycleId) {
			return NextResponse.json({ message: "ID inválido" }, { status: 400 });
		}

		const cycle = await cycleService.getFullCycle(cycleId);

		return NextResponse.json(cycle);
	} catch (err) {
		return handleError(err, "Erro ao buscar ciclo", "Ciclo não encontrado");
	}
}

export async function PATCH(req, { params }) {
	try {
		const cycleId = parseId(params);

		if (!cycleId) {
			return NextResponse.json({ message: "ID inválido" }, { status: 400 });
		}

		const body = await req.json();

		const parsed = createCycleSchema.partial().parse({
			...body,
			userId: 1, // depois vem da session
		});

		const updated = await cycleService.updateCycle(cycleId, parsed);

		return NextResponse.json(updated);
	} catch (err) {
		return handleError(err, "Erro ao atualizar ciclo");
	}
}

export async function DELETE(_req, { params }) {
	try {
		const cycleId = parseId(params);

		if (!cycleId) {
			return NextResponse.json({ message: "ID inválido" }, { status: 400 });
		}

		await cycleService.deleteCycle(cycleId);

		return NextResponse.json({
			message: "Ciclo removido com sucesso",
		});
	} catch (err) {
		return handleError(err, "Erro ao remover ciclo");
	}
}

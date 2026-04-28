import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";
import { formatZodError } from "@/utils/zodErrors";
import { createCycleSchema, idSchema } from "@/lib/modules/cycle/cycle.schema";
import HandleError from "@/utils/handleErrors";

function parseId(params) {
	const { success, data } = idSchema.safeParse(params?.id);
	return success ? data : null;
}

export async function GET({ params }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const cycleId = parseId(await params);

		if (!cycleId) {
			return NextResponse.json({ message: "ID inválido" }, { status: 400 });
		}

		const cycle = await cycleService.getFullCycle(cycleId, Number(session.user.id));

		return NextResponse.json(cycle);
	} catch (err) {
		return HandleError(err, "Erro ao buscar ciclo", "Ciclo não encontrado");
	}
}

export async function PUT(req, { params }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const cycleId = parseId(await params);

		if (!cycleId) {
			return NextResponse.json({ message: "ID inválido" }, { status: 400 });
		}

		const body = await req.json();

		const parsed = createCycleSchema.partial().parse({
			...body,
			userId: Number(session.user.id),
		});

		const updated = await cycleService.updateCycle(cycleId, parsed);

		return NextResponse.json(updated);
	} catch (err) {
		return HandleError(err, "Erro ao atualizar ciclo");
	}
}

export async function DELETE(req, { params }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const cycleId = parseId(await params);

		if (!cycleId) {
			return NextResponse.json({ message: "ID inválido" }, { status: 400 });
		}

		await cycleService.getFullCycle(cycleId, Number(session.user.id));

		await cycleService.deleteCycle(cycleId);

		return NextResponse.json({
			message: "Ciclo removido com sucesso",
		});
	} catch (err) {
		return HandleError(err, "Erro ao remover ciclo");
	}
}

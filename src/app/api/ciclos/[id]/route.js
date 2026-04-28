import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";
import { createCycleSchema, idSchema } from "@/lib/modules/cycle/cycle.schema";
import HandleError from "@/utils/handleErrors";

export async function GET({ params }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const cycleId = idSchema.parse((await params)?.id);

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
			throw new Error("Unauthorized");
		}

		const cycleId = idSchema.parse((await params)?.id);

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
			throw new Error("Unauthorized");
		}

		const cycleId = idSchema.parse((await params)?.id);

		await cycleService.getFullCycle(cycleId, Number(session.user.id));

		await cycleService.deleteCycle(cycleId);

		return NextResponse.json({
			message: "Ciclo removido com sucesso",
		});
	} catch (err) {
		return HandleError(err, "Erro ao remover ciclo");
	}
}

export async function PATCH(req, { params }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const cycleId = idSchema.parse((await params)?.id);

		const body = await req.json();

		const result = await cycleService.updateSubjectHours(cycleId, Number(session.user.id), body);

		return NextResponse.json(result);
	} catch (err) {
		return HandleError(err, "Erro ao atualizar horas do ciclo");
	}
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";
import HandleError from "@/utils/handleErrors";

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}
		const body = await req.json();
		const userId = Number(session.user.id);

		const cycle = await cycleService.createCycle({ ...body, userId });

		return NextResponse.json({ id: cycle.id }, { status: 201 });
	} catch (err) {
		return HandleError(err, "Erro ao criar ciclo");
	}
}

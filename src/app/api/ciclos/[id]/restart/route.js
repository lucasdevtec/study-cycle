import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";
import { idSchema } from "@/lib/modules/cycle/cycle.schema";
import HandleError from "@/utils/handleErrors";

export async function POST(req, { params }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const cycleId = idSchema.parse((await params)?.id);

		const result = await cycleService.restartCycle(cycleId, Number(session.user.id));

		return NextResponse.json(result);
	} catch (err) {
		return HandleError(err, "Erro ao reiniciar ciclo");
	}
}

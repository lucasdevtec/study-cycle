import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";
import { idSchema } from "@/lib/modules/cycle/cycle.schema";
import HandleError from "@/utils/handleErrors";

function parseId(params) {
	const { success, data } = idSchema.safeParse(params?.id);
	return success ? data : null;
}

export async function POST(req, { params }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const cycleId = parseId(await params);

		if (!cycleId) {
			return NextResponse.json({ message: "ID inválido" }, { status: 400 });
		}

		const result = await cycleService.restartCycle(cycleId, Number(session.user.id));

		return NextResponse.json(result);
	} catch (err) {
		return HandleError(err, "Erro ao reiniciar ciclo");
	}
}

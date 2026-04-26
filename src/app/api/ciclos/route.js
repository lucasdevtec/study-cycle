import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig"; // seu arquivo de config
import { cycleService } from "@/lib/modules/cycle/cycle.service";
import { createCycleSchema } from "@/lib/modules/cycle/cycle.schema";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const userId = Number(session.user.id);

		const cycles = await cycleService.getByUser(userId);

		return NextResponse.json({
			userId,
			cycles: cycles.map(cycle => ({
				...cycle,
				subjectsCount: cycle.subjects?.length || 0,
				plannedHours: cycle.subjects?.reduce((sum, s) => sum + s.recommended_hours, 0) || 0,
			})),
		});
	} catch (err) {
		return NextResponse.json({ message: err.message || "Erro ao listar ciclos" }, { status: 500 });
	}
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		const body = await req.json();
		const userId = Number(session.user.id);

		const cycle = await cycleService.createCycle({ ...body, userId });

		return NextResponse.json({ id: cycle.id }, { status: 201 });
	} catch (err) {
		return NextResponse.json({ message: err.message || "Erro ao listar ciclos" }, { status: 500 });
	}
}

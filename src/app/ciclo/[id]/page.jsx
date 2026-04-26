import { getServerSession } from "next-auth";
import { CycleDetails } from "./cycleDetails";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";

export default async function CyclePage({ params }) {
	const session = await getServerSession(authOptions);
	const { id } = params;

	if (!session?.user?.id) {
		redirect("/login");
	}

	const userId = Number(session.user.id);

	try {
		const cycle = await cycleService.getFullCycle(id, userId);

		return <CycleDetails cycle={cycle} />;
	} catch (error) {
		console.error("Erro ao carregar os ciclos:", error);
		return <CycleDetails cycle={[]} error={error.message} />;
	}
}

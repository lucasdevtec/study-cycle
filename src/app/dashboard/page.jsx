import { getServerSession } from "next-auth";
import { Dashboard } from "./dashboard";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		redirect("/login");
	}

	const userId = Number(session.user.id);

	try {
		const cycles = await cycleService.getByUser(userId);

		return <Dashboard cycles={cycles} />;
	} catch (error) {
		console.error("Erro ao carregar os ciclos:", error);
		return <Dashboard cycles={[]} error="Erro ao carregar os ciclos." />;
	}
}

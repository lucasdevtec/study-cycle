import { getServerSession } from "next-auth";
import { Dashboard } from "./dashboard";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";
import { userService } from "@/lib/modules/user/user.service";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		redirect("/login");
	}

	const userId = Number(session.user.id);

	try {
		const cycles = await cycleService.getByUser(userId);
		const user = await userService.getById(userId);

		return <Dashboard cycles={cycles} user={user} />;
	} catch (error) {
		console.error("Erro ao carregar os ciclos:", error);
		return <Dashboard cycles={[]} error="Erro ao carregar os ciclos." />;
	}
}

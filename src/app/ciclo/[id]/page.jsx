import { getServerSession } from "next-auth";
import { Cycle as CycleScreen } from "./cycleScreen";
import { redirect } from "next/navigation";
import { Alert, Box, Container, Stack, Typography } from "@mui/material";
import { authOptions } from "@/lib/authConfig";
import { cycleService } from "@/lib/modules/cycle/cycle.service";
import Link from "next/link";

export default async function CyclePage({ params }) {
	const session = await getServerSession(authOptions);

	const { id } = await params;

	if (!session?.user?.id) {
		const callbackUrl = encodeURIComponent(`/ciclo/${id}`);
		redirect(`/login?callbackUrl=${callbackUrl}`);
	}

	const userId = Number(session.user.id);

	try {
		const cycle = await cycleService.getFullCycle(id, userId);

		if (!cycle) {
			throw new Error("Ciclo não encontrado");
		}

		return <CycleScreen cycle={cycle} />;
	} catch (error) {
		return (
			<Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "background.default" }}>
				<Container maxWidth="md" sx={{ py: 6 }}>
					<Stack spacing={2}>
						<Typography variant="h3">Ciclo</Typography>
						<Alert severity="error">
							{error?.message}. Para voltar, <Link href="/dashboard">clique aqui</Link>.
						</Alert>
					</Stack>
				</Container>
			</Box>
		);
	}
}

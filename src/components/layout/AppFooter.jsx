"use client";

import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { Box, Container, Divider, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";

const footerLinks = [
	{ href: "/", label: "Inicio" },
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/ciclo/criar", label: "Criar ciclo" },
	{ href: "/login", label: "Entrar" },
];

export default function AppFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<Box
			component="footer"
			sx={{
				borderTop: "1px solid rgba(12, 107, 88, 0.12)",
				background: "linear-gradient(180deg, rgba(248, 251, 249, 0.96) 0%, #edf4f1 100%)",
			}}
		>
			<Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
				<Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ justifyContent: "space-between" }}>
					<Stack spacing={1.5} sx={{ maxWidth: 440 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<AutoGraphIcon color="primary" />
							<Typography variant="h6" fontWeight={800}>
								StudyCycle
							</Typography>
						</Box>
						<Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
							Planeje com criterio, distribua suas horas com clareza e mantenha o estudo em movimento sem perder continuidade.
						</Typography>
					</Stack>

					<Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 3, sm: 6 }}>
						<Stack spacing={1}>
							<Typography variant="overline" color="text.secondary">
								Navegacao
							</Typography>
							{footerLinks.map(link => (
								<MuiLink key={link.href} component={Link} href={link.href} underline="hover" color="text.primary" sx={{ fontWeight: 500 }}>
									{link.label}
								</MuiLink>
							))}
						</Stack>

						<Stack spacing={1}>
							<Typography variant="overline" color="text.secondary">
								Metodo
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Afinidade para revelar gargalos.
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Peso estrategico para priorizar melhor.
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Ciclos flexiveis para retomar sem friccao.
							</Typography>
						</Stack>
					</Stack>
				</Stack>

				<Divider sx={{ my: 3, borderColor: "rgba(12, 107, 88, 0.12)" }} />

				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Typography variant="body2" color="text.secondary">
						© {currentYear} StudyCycle. Rotina de estudo com foco e consistencia.
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Feito para quem precisa evoluir sem depender de horarios engessados.
					</Typography>
				</Stack>
			</Container>
		</Box>
	);
}

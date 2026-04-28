"use client";

import BarChartIcon from "@mui/icons-material/BarChart";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TimerIcon from "@mui/icons-material/Timer";
import { Alert, Box, Button, Card, CardContent, Container, Grid, LinearProgress, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { Fragment, useMemo } from "react";
import { CheckCircleOutlined } from "@mui/icons-material";

export function Dashboard({ cycles, user, error = "" }) {
	const totalPlannedHours = useMemo(() => cycles.reduce((acc, cycle) => acc + Number(cycle.plannedHours || 0), 0), [cycles]);

	const dashboardCards = [
		{
			label: "Horas planejadas (todos os ciclos)",
			value: `${totalPlannedHours}h`,
			icon: <TimerIcon color="primary" />,
		},
		{
			label: "Ciclos realizados",
			value: String(user.totalCyclesDone),
			icon: <BarChartIcon color="primary" />,
		},
		{
			label: "Horas realizadas (em todos os ciclos)",
			value: String(user.totalHoursDone),
			icon: <CheckCircleOutlined color="primary" />,
		},
	];

	return (
		<Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "background.default" }}>
			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Stack spacing={1} sx={{ mb: 4 }}>
					<Typography variant="h3">Dashboard</Typography>
					<Typography color="text.secondary">Veja como seu tempo esta distribuido e acompanhe a evolucao do seu ciclo.</Typography>
				</Stack>

				{error ? (
					<Alert severity="error" sx={{ marginBottom: "12px" }}>
						{error}
					</Alert>
				) : null}

				<Grid container spacing={3} sx={{ mb: 4 }}>
					{dashboardCards.map(card => (
						<Grid key={card.label} size={{ xs: 12, md: 4 }}>
							<Card sx={{ height: "100%" }}>
								<CardContent>
									<Stack spacing={2}>
										{card.icon}
										<Typography color="text.secondary">{card.label}</Typography>
										<Typography variant="h4">{card.value}</Typography>
									</Stack>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>

				<Card>
					<CardContent>
						<Stack spacing={2}>
							<Typography variant="h5">Seus ciclos</Typography>
							{cycles.length ? (
								<List disablePadding>
									{cycles.map(cycle => (
										<Fragment key={cycle.id}>
											<ListItem
												secondaryAction={
													<Button component={Link} href={`/ciclo/${cycle.id}`} endIcon={<OpenInNewIcon />} size="small">
														Gerenciar
													</Button>
												}
												sx={{ px: 0 }}
											>
												<ListItemText primary={cycle.name} secondary={`${cycle.subjectsCount} materias • ${cycle.plannedHours}h planejadas`} />
											</ListItem>
											<LinearProgress variant="determinate" value={(cycle.atualCycleHours / cycle.plannedHours) * 100} sx={{ height: 10, width: "100%", borderRadius: 999 }} />
										</Fragment>
									))}
								</List>
							) : (
								<Typography color="text.secondary">Nenhum ciclo criado ainda. Crie seu primeiro ciclo para começar.</Typography>
							)}
						</Stack>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
}

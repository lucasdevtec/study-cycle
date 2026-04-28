"use client";

import { RestartAltOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Alert, Box, Button, Card, CardContent, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function getInitialDoneBySubject(subjects) {
	return subjects.reduce((acc, subject) => {
		acc[subject.id] = Math.min(subject.recommendedHours, subject.hoursDone);
		return acc;
	}, {});
}

export function Cycle({ cycle, error = "" }) {
	const { name: cycleName, id: cycleId, subjects } = cycle;
	const [doneBySubject, setDoneBySubject] = useState(() => getInitialDoneBySubject(subjects));
	const [summary, setSummary] = useState({
		totalCycleDone: Number(cycle.totalCycleDone || 0),
		cycleDone: Boolean(cycle.cycleDone),
	});
	const [savingBySubject, setSavingBySubject] = useState({});
	const [restartingCycle, setRestartingCycle] = useState(false);
	const [requestError, setRequestError] = useState(error);
	const [congratsOpen, setCongratsOpen] = useState(false);

	useEffect(() => {
		setDoneBySubject(getInitialDoneBySubject(subjects));
		setSummary({
			totalCycleDone: Number(cycle.totalCycleDone || 0),
			cycleDone: Boolean(cycle.cycleDone),
		});
	}, [subjects]);

	const totalRecommendedHours = useMemo(() => subjects.reduce((acc, subject) => acc + subject.recommendedHours, 0), [subjects]);

	const totalDoneHours = useMemo(
		() =>
			subjects.reduce((acc, subject) => {
				const subjectDone = Math.min(subject.recommendedHours, Number(doneBySubject[subject.id] || 0));

				return acc + subjectDone;
			}, 0),
		[subjects, doneBySubject],
	);

	const progress = totalRecommendedHours ? Math.round((totalDoneHours / totalRecommendedHours) * 100) : 0;

	async function handleSequentialCheck(subjectId, hourIndex, checked) {
		if (!cycleId || savingBySubject[subjectId]) {
			return;
		}

		const currentDone = Number(doneBySubject[subjectId] || 0);
		const nextDone = checked ? Math.max(currentDone, hourIndex + 1) : hourIndex;

		if (nextDone === currentDone) {
			return;
		}

		setRequestError("");
		setSavingBySubject(current => ({ ...current, [subjectId]: true }));

		try {
			const response = await fetch(`/api/ciclos/${cycleId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					subjectId,
					hoursDone: nextDone,
				}),
			});

			const payload = await response.json();

			if (!response.ok) {
				throw new Error(payload?.message || "Erro ao salvar progresso");
			}

			if (Array.isArray(payload.subjects)) {
				setDoneBySubject(getInitialDoneBySubject(payload.subjects));
			}

			if (payload?.cycle) {
				setSummary({
					totalCycleDone: Number(payload.cycle.totalCycleDone || 0),
					cycleDone: Boolean(payload.cycle.cycleDone),
				});
			}

			if (payload?.cycleJustCompleted) {
				setCongratsOpen(true);
			}
		} catch (err) {
			setRequestError(err?.message || "Erro ao salvar progresso");
		} finally {
			setSavingBySubject(current => ({ ...current, [subjectId]: false }));
		}
	}

	async function handleRestartCycle() {
		if (!cycleId || restartingCycle) {
			return;
		}

		setRequestError("");
		setCongratsOpen(false);
		setRestartingCycle(true);

		try {
			const response = await fetch(`/api/ciclos/${cycleId}/restart`, {
				method: "POST",
			});

			const payload = await response.json();

			if (!response.ok) {
				throw new Error(payload?.message || "Erro ao reiniciar ciclo");
			}

			if (Array.isArray(payload.subjects)) {
				setDoneBySubject(getInitialDoneBySubject(payload.subjects));
			}

			if (payload?.cycle) {
				setSummary({
					totalCycleDone: Number(payload.cycle.totalCycleDone || 0),
					cycleDone: Boolean(payload.cycle.cycleDone),
				});
			}
		} catch (err) {
			setRequestError(err?.message || "Erro ao reiniciar ciclo");
		} finally {
			setRestartingCycle(false);
		}
	}

	return (
		<Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "background.default" }}>
			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Stack spacing={1} sx={{ mb: 4 }}>
					<Typography variant="h3">{cycleName}</Typography>
					<Typography color="text.secondary">Marque as caixinhas conforme cada hora estudada em cada materia.</Typography>
				</Stack>

				{requestError ? (
					<Alert severity="error" sx={{ mb: 2 }}>
						{requestError}
					</Alert>
				) : null}

				<Grid container spacing={3}>
					<Grid size={{ xs: 12, lg: 8 }}>
						<Card>
							<CardContent>
								<Stack spacing={1}>
									{subjects.length ? (
										subjects.map((subject, index) => {
											const subjectDone = Math.min(subject.recommendedHours, Number(doneBySubject[subject.id] || 0));

											return (
												<Box key={subject.id}>
													<Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }} spacing={0.5}>
														<Typography variant="h6">{subject.name}</Typography>
														<Typography color="text.secondary">
															{subjectDone}/{subject.recommendedHours}h
														</Typography>
													</Stack>
													<Stack direction="row" sx={{ flexWrap: "wrap", mt: 1, gap: 0.5 }}>
														{Array.from({ length: subject.recommendedHours }).map((_, hourIndex) => {
															const checked = hourIndex < subjectDone;

															return (
																<Box
																	key={`${subject.id}-${hourIndex}`}
																	sx={{
																		display: "inline-flex",
																		alignItems: "center",
																		border: theme => `1px solid ${theme.palette.divider}`,
																		borderRadius: 1,
																		bgcolor: checked ? "action.selected" : "transparent",
																	}}
																>
																	<Checkbox size="small" checked={checked} disabled={Boolean(savingBySubject[subject.id])} onChange={(_, nextChecked) => handleSequentialCheck(subject.id, hourIndex, nextChecked)} />
																</Box>
															);
														})}
													</Stack>
													{index !== subjects.length - 1 && <Divider sx={{ mt: 1 }} />}
												</Box>
											);
										})
									) : (
										<Typography color="text.secondary">Nenhuma materia cadastrada neste ciclo.</Typography>
									)}
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{ xs: 12, lg: 4 }}>
						<Stack spacing={2}>
							<Card>
								<CardContent>
									<Stack spacing={1.25}>
										<Typography variant="h6">Resumo do ciclo</Typography>
										<Typography color="text.secondary">Horas por ciclo: {cycle.plannedHours}h</Typography>
										<Typography color="text.secondary">Concluido: {totalDoneHours}h</Typography>
										<Typography color="text.secondary">Progresso geral: {progress}%</Typography>
										<LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 999 }} />
										<Typography color="text.secondary">
											Ciclo feito {summary.totalCycleDone ? summary.totalCycleDone : "nenhuma"} {summary.totalCycleDone <= 1 ? "vez" : "vezes"}
										</Typography>
										<Button variant="outlined" disabled={restartingCycle} startIcon={<RestartAltOutlined />} onClick={handleRestartCycle}>
											{restartingCycle ? "Reiniciando..." : "Reiniciar ciclo"}
										</Button>
									</Stack>
								</CardContent>
							</Card>

							<Button component={Link} href={cycleId ? `/ciclo/${cycleId}/edit` : "/dashboard"} variant="outlined" startIcon={<EditOutlinedIcon />}>
								Editar ciclo
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</Container>

			<Dialog open={congratsOpen} onClose={() => setCongratsOpen(false)} fullWidth maxWidth="xs">
				<DialogTitle>Parabens!</DialogTitle>
				<DialogContent>
					<Typography>Voce concluiu todas as horas das materias deste ciclo.</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setCongratsOpen(false)} autoFocus>
						Fechar
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

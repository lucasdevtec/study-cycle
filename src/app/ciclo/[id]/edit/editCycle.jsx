"use client";

import AddIcon from "@mui/icons-material/Add";
import { Alert, Box, Button, Card, CardContent, Container, Divider, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { affinityOptions, calculateCyclePlan } from "@/lib/cycle";
import { DeleteOutlined } from "@mui/icons-material";

export function EditCycle({ cycle }) {
	const router = useRouter();
	const [cycleName, setCycleName] = useState(cycle?.name);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [feedback, setFeedback] = useState({ type: "", message: "" });
	const [weeklyHours, setWeeklyHours] = useState(cycle?.weeklyHours);
	const cycleId = cycle?.id;

	const [subjects, setSubjects] = useState(cycle?.subjects);

	const plan = useMemo(() => calculateCyclePlan({ subjects, weeklyHours }), [subjects, weeklyHours]);

	function updateSubject(index, patch) {
		setSubjects(current =>
			current.map((subject, itemIndex) => {
				if (itemIndex !== index) {
					return subject;
				}
				return { ...subject, ...patch };
			}),
		);
	}

	function addSubject() {
		setSubjects(current => [
			...current,
			{
				id: crypto.randomUUID(),
				name: "",
				affinityRank: 3,
				extraWeight: 0,
			},
		]);
	}

	function removeSubject(index) {
		setSubjects(current => current.filter((_, itemIndex) => itemIndex !== index));
	}

	async function saveCycleChanges() {
		try {
			setIsSaving(true);
			if (!cycleId) {
				throw new Error("ID do ciclo inválido.");
			}

			const cleanedSubjects = subjects
				.map(({ id, ...subject }) => ({
					...subject,
					name: String(subject.name || "").trim(),
				}))
				.filter(subject => subject.name);
			if (!cycleName.trim()) {
				setFeedback({ type: "error", message: "Informe o nome do ciclo." });
				return;
			}
			if (!cleanedSubjects.length) {
				setFeedback({
					type: "error",
					message: "Adicione ao menos uma matéria com nome.",
				});
				return;
			}

			setFeedback({ type: "", message: "" });

			const response = await fetch(`/api/ciclos/${cycleId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: cycleName,
					weeklyHours,
					subjects: cleanedSubjects,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Falha ao salvar ciclo.");
			}

			router.push(`/ciclo/${cycleId}`);
		} catch (error) {
			setFeedback({ type: "error", message: error.message });
		} finally {
			setIsSaving(false);
		}
	}

	async function removeCycle() {
		try {
			if (!cycleId) {
				throw new Error("ID do ciclo inválido.");
			}

			setIsDeleting(true);
			setFeedback({ type: "", message: "" });

			const response = await fetch(`/api/ciclos/${cycleId}`, {
				method: "DELETE",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message || "Falha ao excluir ciclo.");
			}

			router.push("/dashboard");
		} catch (error) {
			setFeedback({ type: "error", message: error.message });
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "background.default" }}>
			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Stack spacing={1} sx={{ mb: 4 }}>
					<Typography variant="h3">Editar ciclo</Typography>
					<Typography color="text.secondary">Informe as matérias, afinidade e pesos extras. O sistema distribui o tempo de forma proporcional e garante mínimo de 2h por matéria.</Typography>
				</Stack>

				<Grid container spacing={3}>
					<Grid size={{ xs: 12, lg: 8 }}>
						<Card>
							<CardContent>
								<Stack spacing={3}>
									<TextField label="Nome do ciclo" value={cycleName} onChange={event => setCycleName(event.target.value)} placeholder="Ex.: Ciclo ENEM Maio" fullWidth />

									<TextField label="Horas semanais disponíveis" type="number" value={weeklyHours} onChange={event => setWeeklyHours(Number(event.target.value))} />

									<Divider />

									<Stack spacing={2}>
										{subjects.map((subject, index) => (
											<Grid container spacing={2} key={subject.id}>
												<Grid size={{ xs: 12, md: 4 }}>
													<TextField label="Matéria" value={subject.name} onChange={event => updateSubject(index, { name: event.target.value })} fullWidth />
												</Grid>
												<Grid size={{ xs: 12, md: 4 }}>
													<TextField
														select
														label="Afinidade"
														value={subject.affinityRank}
														onChange={event =>
															updateSubject(index, {
																affinityRank: Number(event.target.value),
															})
														}
														fullWidth
													>
														{affinityOptions.map(option => (
															<MenuItem key={option.value} value={option.value}>
																{option.label}
															</MenuItem>
														))}
													</TextField>
												</Grid>
												<Grid size={{ xs: 10, md: 3 }}>
													<TextField
														label="Peso extra"
														type="number"
														value={subject.extraWeight}
														onChange={event =>
															updateSubject(index, {
																extraWeight: Number(event.target.value || 0),
															})
														}
														fullWidth
													/>
												</Grid>
												<Grid size={{ xs: 2, md: 1 }}>
													<Button color="error" variant="outlined" onClick={() => removeSubject(index)} fullWidth sx={{ minWidth: 0, height: "100%" }}>
														<DeleteOutlined />
													</Button>
												</Grid>
											</Grid>
										))}

										<Button variant="outlined" startIcon={<AddIcon />} onClick={addSubject}>
											Adicionar matéria
										</Button>

										<Button variant="contained" onClick={saveCycleChanges} disabled={isSaving || isDeleting}>
											{isSaving ? "Salvando..." : "Salvar ciclo"}
										</Button>

										<Button variant="outlined" color="error" onClick={removeCycle} disabled={isSaving || isDeleting}>
											{isDeleting ? "Excluindo..." : "Excluir ciclo"}
										</Button>
									</Stack>
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{ xs: 12, lg: 4 }}>
						<Stack spacing={2}>
							<Alert severity="info">Fórmula usada: horas = ceil((horas semanais / soma dos pesos) * peso final), com mínimo de 2h por matéria.</Alert>
							{feedback.message ? <Alert severity={feedback.type === "error" ? "error" : "success"}>{feedback.message}</Alert> : null}
							<Card>
								<CardContent>
									<Stack spacing={1.5}>
										<Typography variant="h6">Resumo do cálculo</Typography>
										<Typography color="text.secondary">Soma dos pesos: {plan.totalWeight}x</Typography>
										<Typography color="text.secondary">Fator por peso: {plan.factor ? plan.factor.toFixed(2) : "0.00"}h</Typography>
										<Typography color="text.secondary">Total planejado: {plan.totalPlannedHours}h</Typography>
										<Divider sx={{ my: 1 }} />
										{plan.subjects.map(subject => (
											<Typography key={subject.id}>
												{subject.name || "Matéria sem nome"}: {subject.recommendedHours}h ({subject.finalWeight}x)
											</Typography>
										))}
									</Stack>
								</CardContent>
							</Card>
						</Stack>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}

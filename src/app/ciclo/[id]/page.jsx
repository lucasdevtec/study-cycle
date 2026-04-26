"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { affinityOptions, calculateCyclePlan } from "@/lib/cycle";

const emptySubject = {
  name: "",
  affinityRank: 3,
  extraWeight: 0,
};

export default function CycleDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const cycleId = params.id;
  const [cycle, setCycle] = useState(null);
  const [newName, setNewName] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(20);
  const [subjects, setSubjects] = useState([]);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCycle() {
      try {
        const response = await fetch(`/api/ciclos/${cycleId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Falha ao carregar ciclo.");
        }

        setCycle(data);
        setNewName(data.name || "");
        setWeeklyHours(Number(data.weeklyHours || 20));
        setSubjects(
          (data.subjects || []).map((subject) => ({
            name: subject.name,
            affinityRank: Number(subject.affinityRank || 3),
            extraWeight: Number(subject.extraWeight || 0),
          })),
        );
      } catch (error) {
        setFeedback({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    }

    fetchCycle();
  }, [cycleId]);

  const plan = useMemo(
    () => calculateCyclePlan({ subjects, weeklyHours }),
    [subjects, weeklyHours],
  );

  function updateSubject(index, patch) {
    setSubjects((current) =>
      current.map((subject, itemIndex) => {
        if (itemIndex !== index) {
          return subject;
        }

        return { ...subject, ...patch };
      }),
    );
  }

  function addSubject() {
    setSubjects((current) => [...current, emptySubject]);
  }

  function removeSubject(index) {
    setSubjects((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function saveCycleChanges() {
    const cleanedSubjects = subjects
      .map((subject) => ({
        ...subject,
        name: String(subject.name || "").trim(),
      }))
      .filter((subject) => subject.name);

    if (!newName.trim()) {
      setFeedback({ type: "error", message: "Informe o nome do ciclo." });
      return;
    }

    if (!cleanedSubjects.length) {
      setFeedback({
        type: "error",
        message: "Adicione ao menos uma materia com nome.",
      });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/ciclos/${cycleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          weeklyHours,
          subjects: cleanedSubjects,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar nome.");
      }

      setCycle((current) => ({
        ...current,
        name: newName,
        weeklyHours,
      }));
      setFeedback({ type: "success", message: data.message });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function removeCycle() {
    try {
      const response = await fetch(`/api/ciclos/${cycleId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao remover ciclo.");
      }

      router.push("/dashboard");
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppHeader />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stack spacing={2}>
          <Typography variant="h3">Gerenciar ciclo</Typography>
          <Typography color="text.secondary">
            Rota dinamica: /ciclo/{cycleId}
          </Typography>

          {feedback.message ? (
            <Alert severity={feedback.type === "error" ? "error" : "success"}>
              {feedback.message}
            </Alert>
          ) : null}

          {loading ? <Typography>Carregando...</Typography> : null}

          {!loading && cycle ? (
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <TextField
                    label="Nome do ciclo"
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Horas semanais disponiveis"
                    type="number"
                    value={weeklyHours}
                    onChange={(event) =>
                      setWeeklyHours(Number(event.target.value))
                    }
                    inputProps={{ min: 1 }}
                    fullWidth
                  />

                  <Stack spacing={2}>
                    {subjects.map((subject, index) => (
                      <Grid
                        container
                        spacing={2}
                        key={`${subject.name}-${index}`}
                      >
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            label="Materia"
                            value={subject.name}
                            onChange={(event) =>
                              updateSubject(index, { name: event.target.value })
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            select
                            label="Afinidade"
                            value={subject.affinityRank}
                            onChange={(event) =>
                              updateSubject(index, {
                                affinityRank: Number(event.target.value),
                              })
                            }
                            fullWidth
                          >
                            {affinityOptions.map((option) => (
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
                            onChange={(event) =>
                              updateSubject(index, {
                                extraWeight: Number(event.target.value || 0),
                              })
                            }
                            inputProps={{ min: 0 }}
                            fullWidth
                          />
                        </Grid>
                        <Grid size={{ xs: 2, md: 1 }}>
                          <Button
                            color="error"
                            variant="outlined"
                            onClick={() => removeSubject(index)}
                            fullWidth
                            sx={{ minWidth: 0, height: "100%" }}
                          >
                            <DeleteOutlineIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    ))}

                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addSubject}
                    >
                      Adicionar materia
                    </Button>
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={saveCycleChanges}
                      disabled={saving}
                    >
                      {saving ? "Salvando..." : "Salvar alteracoes"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteForeverIcon />}
                      onClick={removeCycle}
                    >
                      Excluir ciclo
                    </Button>
                  </Stack>

                  <Divider />

                  <Typography variant="h6">Resumo</Typography>
                  <Typography color="text.secondary">
                    Horas semanais base: {weeklyHours}h
                  </Typography>
                  <Typography color="text.secondary">
                    Total planejado: {plan.totalPlannedHours}h
                  </Typography>
                  <Typography color="text.secondary">
                    Soma dos pesos: {plan.totalWeight}x
                  </Typography>

                  <Typography variant="h6">Materias do ciclo</Typography>
                  <List disablePadding>
                    {plan.subjects?.map((subject, index) => (
                      <ListItem key={`${subject.name}-${index}`} sx={{ px: 0 }}>
                        <ListItemText
                          primary={subject.name}
                          secondary={`Afinidade ${subject.affinityRank} • Peso final ${subject.finalWeight}x • ${subject.recommendedHours}h`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Stack>
              </CardContent>
            </Card>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}

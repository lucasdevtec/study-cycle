"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { affinityOptions, calculateCyclePlan } from "@/lib/cycle";

const emptySubject = {
  name: "",
  affinityRank: 3,
  extraWeight: 0,
};

export default function CreateCyclePage() {
  const router = useRouter();
  const [cycleName, setCycleName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [weeklyHours, setWeeklyHours] = useState(20);
  const [subjects, setSubjects] = useState([
    { name: "Matematica", affinityRank: 1, extraWeight: 0 },
    { name: "Biologia", affinityRank: 3, extraWeight: 0 },
    { name: "Quimica", affinityRank: 4, extraWeight: 0 },
  ]);

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

  async function saveCycle() {
    const cleanedSubjects = subjects
      .map((subject) => ({
        ...subject,
        name: String(subject.name || "").trim(),
      }))
      .filter((subject) => subject.name);

    if (!cycleName.trim()) {
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

    setIsSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await fetch("/api/ciclos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,
          name: cycleName,
          weeklyHours,
          subjects: cleanedSubjects,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao salvar ciclo.");
      }

      router.push(`/ciclo/${data.id}`);
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h3">Criar ciclo</Typography>
          <Typography color="text.secondary">
            Informe as materias, afinidade e pesos extras. O sistema distribui o
            tempo de forma proporcional e garante minimo de 2h por materia.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <TextField
                    label="Nome do ciclo"
                    value={cycleName}
                    onChange={(event) => setCycleName(event.target.value)}
                    placeholder="Ex.: Ciclo ENEM Maio"
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
                  />

                  <Divider />

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

                    <Button
                      variant="contained"
                      onClick={saveCycle}
                      disabled={isSaving}
                    >
                      {isSaving ? "Salvando..." : "Salvar ciclo"}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2}>
              <Alert severity="info">
                Formula usada: horas = ceil((horas semanais / soma dos pesos) *
                peso final), com minimo de 2h por materia.
              </Alert>
              {feedback.message ? (
                <Alert
                  severity={feedback.type === "error" ? "error" : "success"}
                >
                  {feedback.message}
                </Alert>
              ) : null}
              <Card>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="h6">Resumo do calculo</Typography>
                    <Typography color="text.secondary">
                      Soma dos pesos: {plan.totalWeight}x
                    </Typography>
                    <Typography color="text.secondary">
                      Fator por peso:{" "}
                      {plan.factor ? plan.factor.toFixed(2) : "0.00"}h
                    </Typography>
                    <Typography color="text.secondary">
                      Total planejado: {plan.totalPlannedHours}h
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    {plan.subjects.map((subject) => (
                      <Typography
                        key={`${subject.name}-${subject.affinityRank}-${subject.extraWeight}`}
                      >
                        {subject.name || "Materia sem nome"}:{" "}
                        {subject.recommendedHours}h ({subject.finalWeight}x)
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

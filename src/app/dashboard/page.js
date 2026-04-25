"use client";

import BarChartIcon from "@mui/icons-material/BarChart";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TimerIcon from "@mui/icons-material/Timer";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { CheckCircleOutlined } from "@mui/icons-material";

export default function DashboardPage() {
  const [cycles, setCycles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCycles() {
      try {
        const response = await fetch("/api/ciclos?userId=1");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar ciclos.");
        }

        setCycles(data.cycles || []);
      } catch (fetchError) {
        setError(fetchError.message);
      }
    }

    fetchCycles();
  }, []);

  const totalPlannedHours = useMemo(
    () =>
      cycles.reduce((acc, cycle) => acc + Number(cycle.plannedHours || 0), 0),
    [cycles],
  );

  const totalSubjects = useMemo(
    () =>
      cycles.reduce((acc, cycle) => acc + Number(cycle.subjectsCount || 0), 0),
    [cycles],
  );

  const dashboardCards = [
    {
      label: "Horas planejadas (todos os ciclos)",
      value: `${totalPlannedHours}h`,
      icon: <TimerIcon color="primary" />,
    },
    {
      label: "Ciclos cadastrados",
      value: String(cycles.length),
      icon: <BarChartIcon color="primary" />,
    },
    {
      label: "Disciplinas no total",
      value: String(totalSubjects),
      icon: <CheckCircleOutlined color="primary" />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h3">Dashboard</Typography>
          <Typography color="text.secondary">
            Veja como seu tempo esta distribuido e acompanhe a evolucao do seu
            ciclo.
          </Typography>
        </Stack>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardCards.map((card) => (
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
                  {cycles.map((cycle) => (
                    <ListItem
                      key={cycle.id}
                      secondaryAction={
                        <Button
                          component={Link}
                          href={`/ciclo/${cycle.id}`}
                          endIcon={<OpenInNewIcon />}
                          size="small"
                        >
                          Gerenciar
                        </Button>
                      }
                      sx={{ px: 0 }}
                    >
                      <ListItemText
                        primary={cycle.name}
                        secondary={`${cycle.subjectsCount} materias • ${cycle.plannedHours}h planejadas`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  Nenhum ciclo criado ainda. Crie seu primeiro ciclo para
                  começar.
                </Typography>
              )}
              <Typography variant="h5" sx={{ pt: 1 }}>
                Progresso semanal
              </Typography>
              <Typography color="text.secondary">
                Exemplo visual do indicador de progresso geral.
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, cycles.length * 15)}
                sx={{ height: 10, borderRadius: 999 }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

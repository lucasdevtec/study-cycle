"use client";

import BoltIcon from "@mui/icons-material/Bolt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsightsIcon from "@mui/icons-material/Insights";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import { PlayCircle } from "@mui/icons-material";

const features = [
  {
    title: "Mapeamento de Afinidade",
    description:
      "Classifique cada materia de 1 a 5 para mostrar onde esta sua maior dor.",
    icon: <InsightsIcon color="primary" />,
  },
  {
    title: "Peso Estrategico",
    description:
      "Some pesos extras para materias com edital extenso ou prioridade na prova.",
    icon: <BoltIcon color="primary" />,
  },
  {
    title: "Proporcionalidade Inversa",
    description:
      "Quanto pior sua afinidade, mais horas recomendadas para evoluir rapido.",
    icon: <CalendarMonthIcon color="primary" />,
  },
];

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(150deg, #edf7f4 0%, #fef8e9 100%)",
      }}
    >
      <AppHeader />
      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 10 }, pb: 10 }}>
        <Stack spacing={3} sx={{ mb: 8 }}>
          <Chip
            label="Onde seu esforco encontra o equilibrio"
            color="primary"
            sx={{ width: "fit-content" }}
          />
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "2rem", md: "3.3rem" }, maxWidth: 820 }}
          >
            StudyCycle transforma seu estudo em progresso continuo, sem horarios
            engessados.
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 780, lineHeight: 1.6 }}
          >
            Classifique afinidade, adicione peso estrategico e receba uma
            distribuicao inteligente de horas. Se pausar hoje, voce retoma
            amanha de onde parou.
          </Typography>
          <Box>
            <Button
              component={Link}
              href="/ciclo/criar"
              variant="contained"
              size="large"
              startIcon={<PlayCircle />}
            >
              Comecar Ciclo Gratuitamente
            </Button>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%", border: "1px solid #d8e9e3" }}>
                <CardContent>
                  <Stack spacing={2}>
                    {feature.icon}
                    <Typography variant="h5">{feature.title}</Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

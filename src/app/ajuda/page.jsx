"use client";

import { Box, Card, CardContent, Container, Stack, Typography } from "@mui/material";

const helpItems = [
	{
		title: "Como criar meu primeiro ciclo?",
		description: "Acesse Criar ciclo, informe as horas semanais, adicione matérias e ajuste afinidade e peso extra. O sistema calcula a distribuição automaticamente.",
	},
	{
		title: "Como marcar progresso?",
		description: "Entre em um ciclo e marque as horas concluídas nas caixinhas de cada matéria. O progresso é salvo automaticamente.",
	},
	{
		title: "Esqueci minha senha",
		description: "Na tela de login, clique em Esqueci minha senha e siga o link enviado por email para redefinir sua senha.",
	},
	{
		title: "Não consigo entrar com Google",
		description: "Verifique se a conta Google autorizou o acesso e tente novamente. Se persistir, faça login com email e senha, se disponível.",
	},
];

export default function AjudaPage() {
	return (
		<Box
			sx={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				background: "linear-gradient(150deg, #edf7f4 0%, #fef8e9 100%)",
			}}
		>
			<Container maxWidth="md" sx={{ py: 6 }}>
				<Stack spacing={2.5}>
					<Typography variant="h3">Central de Ajuda</Typography>
					<Typography color="text.secondary">Dúvidas frequentes para te ajudar a usar o StudyCycle com mais tranquilidade.</Typography>

					<Stack spacing={2}>
						{helpItems.map(item => (
							<Card key={item.title} sx={{ border: "1px solid #d8e9e3" }}>
								<CardContent>
									<Stack spacing={1}>
										<Typography variant="h6">{item.title}</Typography>
										<Typography color="text.secondary">{item.description}</Typography>
									</Stack>
								</CardContent>
							</Card>
						))}
						<Card sx={{ border: "1px solid #d8e9e3" }}>
							<CardContent>
								<Stack spacing={1}>
									<Typography variant="h6">Contato</Typography>
									<Typography color="text.secondary">
										Para suporte, acesse{" "}
										<a href="https://www.ltech.dev.br" target="_blank" style={{ color: "blue" }} rel="noopener noreferrer">
											www.ltech.dev.br
										</a>{" "}
										e informe detalhes do problema (tela, horário e ação executada).
									</Typography>
								</Stack>
							</CardContent>
						</Card>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}

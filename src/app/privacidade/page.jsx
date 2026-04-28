"use client";

import { Box, Card, CardContent, Container, Divider, Stack, Typography } from "@mui/material";

export default function PrivacidadePage() {
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
					<Typography variant="h3">Política de Privacidade</Typography>
					<Typography color="text.secondary">Última atualização: 28/04/2026</Typography>

					<Card sx={{ border: "1px solid #d8e9e3" }}>
						<CardContent>
							<Stack spacing={2}>
								<Typography variant="h6">1. Dados que coletamos</Typography>
								<Typography color="text.secondary">Coletamos dados de cadastro e autenticação, como nome, email e informações necessárias para login (incluindo provedor externo quando aplicável).</Typography>

								<Divider />

								<Typography variant="h6">2. Uso das informações</Typography>
								<Typography color="text.secondary">Utilizamos seus dados para permitir acesso à plataforma, gerenciar seus ciclos de estudo e melhorar a experiência no produto.</Typography>

								<Divider />

								<Typography variant="h6">3. Compartilhamento</Typography>
								<Typography color="text.secondary">Não vendemos seus dados. Podemos compartilhar dados apenas com serviços essenciais para funcionamento da plataforma, como autenticação e envio de email.</Typography>

								<Divider />

								<Typography variant="h6">4. Segurança</Typography>
								<Typography color="text.secondary">Aplicamos medidas técnicas razoáveis para proteger informações pessoais. Ainda assim, nenhum sistema é totalmente livre de riscos.</Typography>

								<Divider />

								<Typography variant="h6">5. Seus direitos</Typography>
								<Typography color="text.secondary">Você pode solicitar atualização, correção ou exclusão de dados pessoais conforme legislação aplicável.</Typography>
							</Stack>
						</CardContent>
					</Card>
				</Stack>
			</Container>
		</Box>
	);
}

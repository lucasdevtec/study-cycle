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
								<Typography color="text.secondary">
									Coletamos os seguintes tipos de dados:
									<br />
									<br />
									<strong>Dados fornecidos por você:</strong>
									<br />• Nome
									<br />• Email
									<br />• Informações de login
									<br />
									<br />
									<strong>Dados coletados automaticamente:</strong>
									<br />• Identificadores de dispositivo
									<br />• Tipo de dispositivo e sistema operacional
									<br />• Dados de uso da aplicação
									<br />
									<br />
									<strong>Login com terceiros:</strong>
									<br />
									Ao utilizar provedores como Google, recebemos dados básicos autorizados por você.
								</Typography>

								<Divider />

								<Typography variant="h6">2. Como usamos os dados</Typography>
								<Typography color="text.secondary">
									Utilizamos seus dados para:
									<br />• Criar e autenticar sua conta
									<br />• Sincronizar dados entre aplicativo e versão web
									<br />• Fornecer funcionalidades da plataforma
									<br />• Melhorar desempenho e experiência do usuário
								</Typography>

								<Divider />

								<Typography variant="h6">3. Compartilhamento de dados</Typography>
								<Typography color="text.secondary">
									Não vendemos seus dados.
									<br />
									<br />
									Podemos compartilhar dados com serviços essenciais, como:
									<br />• Serviços de autenticação
									<br />• Hospedagem e banco de dados
									<br />• Serviços de envio de email
									<br />
									<br />
									Esses serviços utilizam os dados apenas para permitir o funcionamento da plataforma.
								</Typography>

								<Divider />

								<Typography variant="h6">4. Armazenamento e segurança</Typography>
								<Typography color="text.secondary">
									Seus dados são armazenados em servidores seguros.
									<br />
									<br />
									Adotamos medidas técnicas para proteger suas informações, mas nenhum sistema é totalmente seguro.
								</Typography>

								<Divider />

								<Typography variant="h6">5. Retenção de dados</Typography>
								<Typography color="text.secondary">Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para fornecer nossos serviços.</Typography>

								<Divider />

								<Typography variant="h6">6. Seus direitos</Typography>
								<Typography color="text.secondary">
									Você pode, a qualquer momento:
									<br />• Solicitar acesso aos seus dados
									<br />• Corrigir informações incorretas
									<br />• Solicitar a exclusão da sua conta e dados
								</Typography>

								<Divider />

								<Typography variant="h6">7. Exclusão de conta</Typography>
								<Typography color="text.secondary">Você pode solicitar a exclusão da sua conta e de todos os dados associados entrando em contato pelos canais oficiais da plataforma.</Typography>

								<Divider />

								<Typography variant="h6">8. Uso no aplicativo móvel</Typography>
								<Typography color="text.secondary">
									Esta política se aplica tanto ao aplicativo móvel quanto à versão web.
									<br />
									<br />
									Os dados são sincronizados entre as plataformas para garantir continuidade de uso.
								</Typography>

								<Divider />

								<Typography variant="h6">9. Alterações nesta política</Typography>
								<Typography color="text.secondary">Podemos atualizar esta política periodicamente. Recomendamos revisá-la regularmente.</Typography>

								<Divider />

								<Typography variant="h6">10. Contato</Typography>
								<Typography color="text.secondary">Em caso de dúvidas, entre em contato pelos canais oficiais da plataforma.</Typography>
							</Stack>
						</CardContent>
					</Card>
				</Stack>
			</Container>
		</Box>
	);
}

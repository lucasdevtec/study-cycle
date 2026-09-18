"use client";

import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import { MailOutlined } from "@mui/icons-material";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			const response = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data?.message || "Erro ao solicitar redefinição de senha");
			}

			setSuccess(data.message || "Confira seu e-mail para continuar.");
		} catch (err) {
			setError(err?.message || "Erro ao solicitar redefinição de senha");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Box sx={{ flex: 1, display: "flex", flexDirection: "column", background: "linear-gradient(170deg, #f3fbf8 0%, #ffffff 60%)" }}>
			<Container maxWidth="sm" sx={{ py: 8 }}>
				<Card sx={{ border: "1px solid #d9ebe4" }}>
					<CardContent sx={{ p: 4 }}>
						<Stack spacing={3}>
							<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
								<MailOutlined color="primary" />
								<Typography variant="h4">Esqueci minha senha</Typography>
							</Stack>

							<Typography color="text.secondary">Digite seu e-mail para receber o link de redefinição.</Typography>

							{error ? <Alert severity="error">{error}</Alert> : null}
							{success ? <Alert severity="success">{success}</Alert> : null}

							<form onSubmit={handleSubmit}>
								<Stack spacing={2}>
									<TextField label="Email" type="email" fullWidth value={email} onChange={event => setEmail(event.target.value)} disabled={loading} required />
									<Button variant="contained" size="large" type="submit" disabled={loading} sx={{ position: "relative" }}>
										{loading ? <CircularProgress size={24} sx={{ position: "absolute", left: "50%", marginLeft: "-12px" }} /> : null}
										<span style={{ visibility: loading ? "hidden" : "visible" }}>Enviar link</span>
									</Button>
									<Button href="/login" variant="text" disabled={loading}>
										Voltar ao login
									</Button>
								</Stack>
							</form>
						</Stack>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
}

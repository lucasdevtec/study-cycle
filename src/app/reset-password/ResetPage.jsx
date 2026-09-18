"use client";

import { useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import { LockReset } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		setSuccess("");

		if (!token) {
			setError("Token inválido.");
			return;
		}

		if (password !== confirmPassword) {
			setError("As senhas não conferem.");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token, password }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data?.message || "Erro ao redefinir senha");
			}

			setSuccess(data.message || "Senha redefinida com sucesso.");
			setTimeout(() => router.push("/login"), 1200);
		} catch (err) {
			setError(err?.message || "Erro ao redefinir senha");
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
								<LockReset color="primary" />
								<Typography variant="h4">Redefinir senha</Typography>
							</Stack>

							{error ? <Alert severity="error">{error}</Alert> : null}
							{success ? <Alert severity="success">{success}</Alert> : null}

							<form onSubmit={handleSubmit}>
								<Stack spacing={2}>
									<TextField label="Nova senha" type="password" fullWidth value={password} onChange={event => setPassword(event.target.value)} disabled={loading} required helperText="Mínimo 8 caracteres" />
									<TextField label="Confirmar nova senha" type="password" fullWidth value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} disabled={loading} required />
									<Button variant="contained" size="large" type="submit" disabled={loading} sx={{ position: "relative" }}>
										{loading ? <CircularProgress size={24} sx={{ position: "absolute", left: "50%", marginLeft: "-12px" }} /> : null}
										<span style={{ visibility: loading ? "hidden" : "visible" }}>Salvar nova senha</span>
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

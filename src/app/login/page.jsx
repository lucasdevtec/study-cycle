"use client";

import { useState } from "react";
import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography, Alert, CircularProgress, Divider } from "@mui/material";
import { Google as GoogleIcon, LockOutlined } from "@mui/icons-material";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	const handleCredentialsLogin = async e => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				if (result.error === "CredentialsSignin") {
					setError("Email ou senha inválidos!");
				} else {
					setError(result.error);
				}
			} else if (result?.ok) {
				router.push(callbackUrl);
			}
		} catch (err) {
			setError("Erro ao fazer login. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			await signIn("google", { callbackUrl });
		} catch (err) {
			setError("Erro ao fazer login com Google.");
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				background: "linear-gradient(170deg, #f3fbf8 0%, #ffffff 60%)",
			}}
		>
			<Container maxWidth="sm" sx={{ py: 8 }}>
				<Card sx={{ border: "1px solid #d9ebe4" }}>
					<CardContent sx={{ p: 4 }}>
						<Stack spacing={3}>
							<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
								<LockOutlined color="primary" />
								<Typography variant="h4">Entrar no StudyCycle</Typography>
							</Stack>

							{error && <Alert severity="error">{error}</Alert>}

							<form onSubmit={handleCredentialsLogin}>
								<Stack spacing={2}>
									<TextField label="Email" type="email" fullWidth value={email} onChange={e => setEmail(e.target.value)} disabled={loading} required />
									<TextField label="Senha" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} disabled={loading} required />
									<Button variant="contained" size="large" type="submit" disabled={loading} sx={{ position: "relative" }}>
										{loading && (
											<CircularProgress
												size={24}
												sx={{
													position: "absolute",
													left: "50%",
													marginLeft: "-12px",
												}}
											/>
										)}
										<span style={{ visibility: loading ? "hidden" : "visible" }}>Entrar</span>
									</Button>
								</Stack>
							</form>

							<Divider sx={{ my: 1 }}>ou</Divider>

							<Button variant="outlined" size="large" onClick={handleGoogleLogin} disabled={loading} startIcon={<GoogleIcon />}>
								Entrar com Google
							</Button>

							<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
								Não tem conta?
								<Button variant="text" size="small" href="/signup" sx={{ textTransform: "none" }}>
									Registre-se
								</Button>
							</Typography>
						</Stack>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
}

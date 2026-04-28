import bcrypt from "bcryptjs";
import { userRepo } from "@/database/repositories/userRepo";
import { withTransaction } from "@/database/transaction";
import { loginSchema, registerSchema, googleLoginSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/modules/auth/auth.schema";
import { createPasswordResetToken, verifyPasswordResetToken } from "@/lib/modules/auth/passwordResetToken";
import { sendPasswordResetEmail } from "@/lib/modules/auth/passwordResetEmail";

export const authService = {
	async loginWithGoogle(data) {
		const { email, name, providerId } = googleLoginSchema.parse(data);

		return withTransaction(async client => {
			let user = await userRepo.findByEmail(email, client);

			if (!user) {
				user = await userRepo.create(name, email, client);
			}

			const existingAccount = await userRepo.findAccount(user.id, "google", client);

			if (!existingAccount) {
				await userRepo.createAccount(
					{
						userId: user.id,
						type: "oauth",
						provider: "google",
						providerAccountId: providerId,
						passwordHash: null,
					},
					client,
				);
			}

			return this._safe(user);
		});
	},

	async login(data) {
		const { email, password } = loginSchema.parse(data);

		const user = await userRepo.findByEmail(email);
		if (!user) throw new Error("Credenciais inválidas");

		const account = await userRepo.findAccount(user.id, "credentials");

		if (!account || !account.passwordHash) {
			throw new Error("Esta conta utiliza login social. Entre com o Google.");
		}

		const ok = await bcrypt.compare(password, account.passwordHash);
		if (!ok) throw new Error("Credenciais inválidas");

		return this._safe(user);
	},

	async register(data) {
		const { name, email, password } = registerSchema.parse(data);

		return withTransaction(async client => {
			const existing = await userRepo.findByEmail(email, client);
			if (existing) {
				throw new Error("Email já cadastrado");
			}

			const user = await userRepo.create(name, email, client);
			const hashedPassword = await bcrypt.hash(password, 10);

			await userRepo.createAccount(
				{
					userId: user.id,
					type: "credentials",
					provider: "credentials",
					providerAccountId: user.id.toString(),
					passwordHash: hashedPassword,
				},
				client,
			);

			return this._safe(user);
		});
	},

	async forgotPassword(data) {
		const { email } = forgotPasswordSchema.parse(data);

		const user = await userRepo.findByEmail(email);
		if (!user) {
			return true;
		}

		const account = await userRepo.findAccount(user.id, "credentials");
		if (!account?.passwordHash) {
			return true;
		}

		const token = createPasswordResetToken({
			userId: user.id,
			email: user.email,
			passwordHash: account.passwordHash,
		});

		const baseUrl = process.env.NEXTAUTH_URL;
		if (!baseUrl) {
			throw new Error("NEXTAUTH_URL não configurado");
		}

		const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

		await sendPasswordResetEmail({
			to: user.email,
			resetLink,
		});

		return true;
	},

	async resetPassword(data) {
		const { token, password } = resetPasswordSchema.parse(data);

		const payloadOnly = String(token || "").split(".")[0];
		if (!payloadOnly) {
			throw new Error("Token inválido");
		}

		let parsedPayload;
		try {
			parsedPayload = JSON.parse(Buffer.from(payloadOnly, "base64url").toString());
		} catch {
			throw new Error("Token inválido");
		}

		const user = await userRepo.findById(Number(parsedPayload?.userId));
		if (!user) {
			throw new Error("Token inválido ou expirado");
		}

		const account = await userRepo.findAccount(user.id, "credentials");
		if (!account?.passwordHash) {
			throw new Error("Token inválido ou expirado");
		}

		const tokenData = verifyPasswordResetToken(token, account.passwordHash);
		if (tokenData.userId !== user.id || tokenData.email !== user.email) {
			throw new Error("Token inválido ou expirado");
		}

		const passwordHash = await bcrypt.hash(password, 10);
		await userRepo.updateCredentialsPassword(user.id, passwordHash);

		return true;
	},

	_safe(user) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	},
};

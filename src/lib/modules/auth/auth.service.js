import bcrypt from "bcryptjs";
import { userRepo } from "@/database/repositories/userRepo";
import { withTransaction } from "@/database/transaction";
import { loginSchema, registerSchema, googleLoginSchema } from "@/lib/modules/auth/auth.schema";

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

	_safe(user) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	},
};

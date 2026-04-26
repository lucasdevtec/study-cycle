import bcrypt from "bcryptjs";
import { userRepo } from "@/database/repositories/userRepo";
import { withTransaction } from "@/database/transaction";
import { loginSchema, registerSchema, googleLoginSchema } from "@/lib/modules/auth/auth.schema";

export const authService = {
	async login(data) {
		const { email, password } = loginSchema.parse(data);

		const user = await userRepo.findByEmail(email);

		if (!user || !user.password) {
			throw new Error("Credenciais inválidas");
		}

		const ok = await bcrypt.compare(password, user.password);

		if (!ok) {
			throw new Error("Credenciais inválidas");
		}

		return this._safe(user);
	},

	async register(data) {
		const parsed = registerSchema.parse(data);

		return withTransaction(async client => {
			const existing = await userRepo.findByEmail(parsed.email, client);

			if (existing) {
				throw new Error("Email já cadastrado");
			}

			const user = await userRepo.create(parsed, client);

			return this._safe(user);
		});
	},

	async loginWithGoogle(data) {
		const { email, name, providerId } = googleLoginSchema.parse(data);

		return withTransaction(async client => {
			let user = await userRepo.findByEmail(email, client);

			if (!user) {
				user = await userRepo.create(
					{
						name: name || "Google User",
						email,
						password: null,
						provider: "google",
						provider_id: providerId,
					},
					client,
				);
			}

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

import bcrypt from "bcryptjs";
import { userRepo } from "@/repositories/userRepo";
import { withTransaction } from "@/database/transaction";

export const authService = {
	async login({ email, password }) {
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

	async register({ name, email, password }) {
		return withTransaction(async client => {
			const existing = await userRepo.findByEmail(email, client);

			if (existing) {
				throw new Error("Email já cadastrado");
			}

			const user = await userRepo.create({ name, email, password }, client);

			return this._safe(user);
		});
	},

	async loginWithGoogle({ email, name, providerId }) {
		return withTransaction(async client => {
			let user = await userRepo.findByEmail(email, client);

			if (!user) {
				user = await userRepo.create(
					{
						name,
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

import { userRepo } from "@/database/repositories/userRepo";
import { userIdSchema } from "@/lib/modules/user/user.schema";

export const userService = {
	async getById(id) {
		const parsedId = userIdSchema.parse(id);

		const user = await userRepo.findById(parsedId);

		if (!user) {
			throw new Error("Usuário não encontrado");
		}

		return this._safe(user);
	},

	async getByEmail(email) {
		const user = await userRepo.findByEmail(email);
		return user ? this._safe(user) : null;
	},

	async list() {
		const users = await userRepo.findAll();
		return users.map(this._safe);
	},

	_safe(user) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	},
};

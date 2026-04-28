import { query } from "@/database/query";
import { snakeToCamel } from "@/utils/snakeToCamelCase";

export const userRepo = {
	async findByEmail(email, client) {
		const { rows } = await query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email], client);
		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async findAccount(userId, provider, client) {
		const { rows } = await query(`SELECT * FROM accounts WHERE user_id = $1 AND provider = $2`, [userId, provider], client);
		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async create(name, email, client) {
		const { rows } = await query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email], client);
		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async createAccount({ userId, type, provider, providerAccountId, passwordHash }, client) {
		const { rows } = await query(
			`INSERT INTO accounts (user_id, type, provider, provider_account_id, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
			[userId, type, provider, providerAccountId, passwordHash || null],
			client,
		);
		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async findById(id, client) {
		const { rows } = await query(`SELECT * FROM users WHERE id = $1`, [id], client);

		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async findAll(client) {
		const { rows } = await query(`SELECT id, name, email FROM users`, [], client);
		return snakeToCamel(rows);
	},

	async addCycleCompletion(userId, hoursToAdd, client) {
		const { rows } = await query(
			`UPDATE users
       SET total_cycles_done = total_cycles_done + 1,
           total_hours_done = total_hours_done + $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
			[hoursToAdd, userId],
			client,
		);

		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async updateCredentialsPassword(userId, passwordHash, client) {
		const { rows } = await query(
			`UPDATE accounts
       SET password_hash = $1
       WHERE user_id = $2
         AND provider = 'credentials'
       RETURNING *`,
			[passwordHash, userId],
			client,
		);

		return rows[0] ? snakeToCamel(rows[0]) : null;
	},
};

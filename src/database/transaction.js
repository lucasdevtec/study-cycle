import pool from "./db.js";

export async function withTransaction(fn) {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		const result = await fn(client);

		await client.query("COMMIT");
		return result;
	} catch (err) {
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
	}
}

/**
 * Executes a function within a database transaction.
 * @param {Function} fn - The function to execute within the transaction.
 * @returns {Promise<*>} - The result of the function execution.
 * @throws {Error} - If the transaction fails, the error is thrown.
import { withTransaction } from "@/database/transaction";

await withTransaction(async (client) => {
	await client.query(...);
	await client.query(...);
});
*/

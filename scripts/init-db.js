import fs from "fs";
import path from "path";
import pool from "../src/database/db.js";

async function run() {
	const client = await pool.connect();

	try {
		const sql = fs.readFileSync(path.join(process.cwd(), "src/database/schema.sql"), "utf-8");

		await client.query("SET search_path TO public;");
		await client.query("BEGIN");

		await client.query(sql);

		await client.query("COMMIT");

		console.log("✅ Banco inicializado com sucesso");
		process.exit(0);
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("❌ Erro ao inicializar banco:", err);
		process.exit(1);
	} finally {
		client.release();
	}
}

run();

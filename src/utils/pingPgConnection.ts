import pool from "../http/lib/pg";
import { PoolClient } from "pg";
import { initDatabaseSchemas } from "./initDatabaseSchemas";

export async function pigPgConnection() {
  let connection: PoolClient | null = null;

  try {
    connection = await pool.connect();

    const {
      rows: [ping],
    } = await connection.query("SELECT CURRENT_TIME;");

    if (ping != null) {
      console.log("Postgres connected on port: " + process.env.POSTGRES_PORT);

      await initDatabaseSchemas();
    }
  } catch (e) {
    console.log("Error while connecting to Postgres...", e);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

import { Pool, PoolClient, PoolConfig } from "pg";
import "dotenv/config";

const config: PoolConfig = {
  port: +process.env.POSTGRES_PORT!,
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  max: 20,
};

const pool = new Pool(config);

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

export async function initDatabaseSchemas() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tb_users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
      full_name VARCHAR(50) NOT NULL, 
      password VARCHAR NOT NULL, 
      email VARCHAR(50) NOT NULL UNIQUE, 
      created_at TIMESTAMP NOT NULL DEFAULT now(), 
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    )
  `);
}

export default pool;

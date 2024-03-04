import { Pool, PoolConfig } from "pg";
import "dotenv/config";

const config: PoolConfig = {
  port: +process.env.POSTGRES_PORT!,
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  max: 20,
};

const pool = new Pool(config);

export default pool;

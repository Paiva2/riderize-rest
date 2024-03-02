import pool from "../http/lib/pg";

export async function initDatabaseSchemas() {
  try {
    const {
      rows: [tablesAlreadyCrated],
    } = await pool.query(`
        SELECT EXISTS (
          SELECT FROM pg_tables
          WHERE schemaname = 'public'
          AND tablename  = 'tb_users'
        );
      `);

    if (tablesAlreadyCrated.exists) return;

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

    await pool.query(`
        CREATE TABLE IF NOT EXISTS tb_pedals (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          start_date TIMESTAMP NOT NULL,
          start_date_registration TIMESTAMP NOT NULL,
          end_date_registration TIMESTAMP NOT NULL,
          additional_information VARCHAR(250),
          start_place VARCHAR(250) NOT NULL,
          participans_limit INTEGER NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT now(), 
          updated_at TIMESTAMP NOT NULL DEFAULT now(),
          pedal_owner_id UUID NOT NULL REFERENCES tb_users(id) ON DELETE CASCADE
        )
      `);
  } catch (e) {
    console.error(e);
    console.log("Error while creating initial tables...");
  }
}

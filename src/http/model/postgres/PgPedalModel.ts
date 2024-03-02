import {
  IPedalCreationRequest,
  IPedal,
  IPedalListPaginated,
} from "../../../@types/pedal.types";
import pool from "../../lib/pg";
import PedalRepository from "../../repositories/pedalRepository";
export default class PgPedalModel implements PedalRepository {
  async save(
    userId: string,
    {
      name,
      startDate,
      startDateRegistration,
      endDateRegistration,
      additionalInformation,
      startPlace,
      participantsLimit,
    }: IPedalCreationRequest
  ): Promise<IPedal> {
    const { rows } = await pool.query(
      `
      INSERT INTO tb_pedals (
        name,
        start_date,
        start_date_registration,
        end_date_registration,
        additional_information,
        start_place,
        participants_limit,
        pedal_owner_id
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        name,
        startDate,
        startDateRegistration,
        endDateRegistration,
        additionalInformation,
        startPlace,
        participantsLimit,
        userId,
      ]
    );

    return this.formatModelReturn(rows[0]);
  }

  async listAll(page: number, perPage: number): Promise<IPedalListPaginated> {
    const { rows } = await pool.query(
      `
      SELECT * FROM tb_pedals 
      WHERE DATE(end_date_registration) >= CURRENT_DATE  
      ORDER BY created_at DESC
      LIMIT $2 OFFSET ($1 - 1) * $2
   `,
      [page, perPage]
    );

    const { rows: totalCount } = await pool.query(`
      SELECT COUNT(*)
      FROM tb_pedals
      WHERE DATE(end_date_registration) >= CURRENT_DATE;
    `);

    const totalItens = +totalCount[0].count;

    return {
      page,
      perPage,
      totalItens,
      pedals: rows.map((pedal) => {
        return this.formatModelReturn(pedal);
      }),
    };
  }

  async findById(pedalId: string): Promise<IPedal | null> {
    const { rows } = await pool.query(`SELECT * FROM tb_pedals WHERE id = $1`, [
      pedalId,
    ]);

    if (!rows.length) return null;

    return this.formatModelReturn(rows[0]);
  }

  async insertSubscriber(pedalId: string): Promise<IPedal> {
    const { rows } = await pool.query(
      `
      WITH curr_val AS (
        SELECT participants_count FROM tb_pedals WHERE id = $1;
      )

      UPDATE tb_pedals WHERE id = $1 SET participants_count = (SELECT * curr_val) + 1 RETURNING *
    `,
      [pedalId]
    );

    return this.formatModelReturn(rows[0]);
  }

  private formatModelReturn(data: any): IPedal {
    return {
      id: data.id,
      name: data.name,
      additionalInformation: data.additional_information,
      startDate: data.start_date,
      startDateRegistration: data.startDate_registration,
      endDateRegistration: data.end_date_registration,
      startPlace: data.start_place,
      participantsLimit: data.participans_limit,
      participantsCount: data.participants_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      pedalOwnerId: data.pedal_owner_id,
    };
  }
}

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
      participansLimit,
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
        participans_limit,
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
        participansLimit,
        userId,
      ]
    );

    return rows[0] as IPedal;
  }

  async listAll(page: number, perPage: number): Promise<IPedalListPaginated> {
    const { rows } = await pool.query(
      `
      SELECT * FROM tb_pedals 
      WHERE DATE(end_date_registration) >= CURRENT_DATE  
      ORDER BY created_at DESC
      LIMIT $2 OFFSET ($1 - 1) * $2;
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
        return {
          id: pedal.id,
          name: pedal.name,
          additionalInformation: pedal.additional_information,
          startDate: pedal.start_date,
          startDateRegistration: pedal.startDate_registration,
          endDateRegistration: pedal.end_date_registration,
          startPlace: pedal.start_place,
          participansLimit: pedal.participans_limit,
          createdAt: pedal.created_at,
          updatedAt: pedal.updated_at,
          pedalOwnerId: pedal.pedal_owner_id,
        };
      }),
    };
  }
}

import { IPedalCreationRequest, IPedal } from "../../../@types/pedal.types";
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
}

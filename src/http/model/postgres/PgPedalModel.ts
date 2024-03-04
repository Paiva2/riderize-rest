import {
  IPedalCreationRequest,
  IPedal,
  IPedalListPaginated,
} from "../../../@types/pedal.types";
import pool from "../../lib/pg";
import redis from "../../lib/redis";
import PedalRepository from "../../repositories/pedalRepository";
import RedisCacheModel from "../redis-cache/redisCacheModel";
export default class PgPedalModel implements PedalRepository {
  private cache = new RedisCacheModel();

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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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

    const formattedNewPedal = this.formatModelReturn(rows[0]);

    await redis.zadd(
      "pedal-all",
      formattedNewPedal.createdAt.getTime(),
      JSON.stringify(formattedNewPedal)
    );

    return formattedNewPedal;
  }

  async listAll(page: number, perPage: number): Promise<IPedalListPaginated> {
    const totalItens = await this.cache.countSetSize("pedal-all");

    const cachedItems = await this.cache.fetchAllWithKey("pedal-all", {
      page,
      perPage,
    });

    return {
      page,
      perPage,
      totalItens,
      pedals: cachedItems,
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
        SELECT participants_count FROM tb_pedals WHERE id = $1
      ), perform_update AS (
        UPDATE tb_pedals SET participants_count = (SELECT * FROM curr_val) + 1 WHERE id = $1 RETURNING *
      )
      
      SELECT * FROM perform_update;      
    `,
      [pedalId]
    );

    return this.formatModelReturn(rows[0]);
  }

  async findAllByUserId(
    userId: string,
    { page, perPage }: { page: number; perPage: number }
  ): Promise<IPedalListPaginated> {
    const { rows } = await pool.query(
      `
        SELECT * FROM tb_pedals
        WHERE pedal_owner_id = $3
        ORDER BY created_at DESC
        LIMIT $2 OFFSET ($1 - 1) * $2
        `,
      [page, perPage, userId]
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
      pedals: rows.map((pedal) => this.formatModelReturn(pedal)),
    };
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
      participantsLimit: data.participants_limit,
      participantsCount: data.participants_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      pedalOwnerId: data.pedal_owner_id,
    };
  }
}

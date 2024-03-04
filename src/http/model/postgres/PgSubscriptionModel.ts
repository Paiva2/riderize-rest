import {
  ISubscription,
  ISubscriptionListPaginated,
} from "../../../@types/subscription.types";
import SusbcriptionRepository from "../../repositories/subscriptionRepository";
import pool from "../../lib/pg";

export default class PgSubscriptionModel implements SusbcriptionRepository {
  async save(subscription: {
    userId: string;
    rideId: string;
  }): Promise<ISubscription> {
    const { rows } = await pool.query(
      `
        INSERT INTO tb_subscriptions (ride_id, user_id)
        VALUES($1, $2)
        RETURNING *
    `,
      [subscription.rideId, subscription.userId]
    );

    const newSub = rows[0];

    return this.formatModelReturn(newSub);
  }

  async findSubscription(subscription: {
    userId: string;
    rideId: string;
  }): Promise<ISubscription | null> {
    const { rows } = await pool.query(
      `
      SELECT * FROM tb_subscriptions
      WHERE user_id = $1 AND ride_id = $2
    `,
      [subscription.userId, subscription.rideId]
    );

    if (!rows.length) return null;

    const find = rows[0];

    return this.formatModelReturn(find);
  }

  async findAllByUserId(
    userId: string,
    pagination: { page: number; perPage: number }
  ): Promise<ISubscriptionListPaginated> {
    const { rows } = await pool.query(
      `
      select 
        sub.id,
        sub.subscription_date,
        sub.user_id,
        sub.ride_id,
        sub.created_at,
        sub.updated_at,
        pd.id as pedal_id,
        pd."name" as pedal_name,
        pd.start_date as pedal_start_date,
        pd.start_date_registration as pedal_start_date_registration,
        pd.end_date_registration as pedal_end_date_registration,
        pd.additional_information as pedal_additional_information,
        pd.start_place as pedal_start_place,
        pd.participants_limit as pedal_participants_limit,
        pd.participants_count as pedal_participants_count,
        pd.created_at as pedal_created_at,
        pd.updated_at as pedal_updated_at,
        pd.pedal_owner_id
      from tb_subscriptions sub 
      inner join tb_pedals pd 
      on sub.ride_id = pd.id 
      where sub.user_id = $1 order by created_at DESC
      LIMIT $3
      OFFSET ($2 - 1) * $3
      ;
    `,
      [userId, +pagination.page, +pagination.perPage]
    );

    const { rows: total } = await pool.query(
      `SELECT COUNT(*) FROM tb_subscriptions WHERE user_id = $1`,
      [userId]
    );

    return {
      page: pagination.page,
      perPage: pagination.perPage,
      totalItens: Number(total[0].count),
      subscriptions: rows.map((sub) => {
        return {
          id: sub.id,
          rideId: sub.ride_id,
          userId: sub.user_id,
          subscriptionDate: sub.subscription_date,
          createdAt: sub.created_at,
          updatedAt: sub.updated_at,
          pedal: {
            id: sub.pedal_id,
            name: sub.pedal_name,
            startDate: sub.pedal_start_date,
            startDateRegistration: sub.pedal_start_date_registration,
            endDateRegistration: sub.end_date_registration,
            additionalInformation: sub.pedal_additional_information,
            startPlace: sub.pedal_start_place,
            participantsLimit: sub.pedal_participants_limit,
            participantsCount: sub.pedal_participants_count,
            createdAt: sub.pedal_created_at,
            updatedAt: sub.pedal_updated_at,
            pedalOwnerId: sub.pedal_owner_id,
          },
        };
      }),
    };
  }

  private formatModelReturn(data: any): ISubscription {
    return {
      id: data.id,
      rideId: data.ride_id,
      userId: data.user_id,
      subscriptionDate: data.subscription_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

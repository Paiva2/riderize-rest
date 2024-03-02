import { ISubscription } from "../../../@types/subscription.types";
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

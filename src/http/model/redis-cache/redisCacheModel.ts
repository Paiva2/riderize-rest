import { IPedal } from "../../../@types/pedal.types";
import redis from "../../lib/redis";
import CacheRepository from "../../repositories/cacheRepository";

export default class RedisCacheModel implements CacheRepository {
  public constructor() {}

  public async fetchAllWithKey(
    keyPattern: string,
    { page, perPage }: { page: number; perPage: number }
  ) {
    const cachedItems: IPedal[] = [];

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage - 1;

    const matches = await redis.zrevrange(keyPattern, startIndex, endIndex);

    matches.forEach((item) => {
      if (item) {
        cachedItems.push(JSON.parse(item));
      }
    });

    return cachedItems;
  }

  async countSetSize(key: string): Promise<number> {
    return await redis.zcard(key);
  }
}

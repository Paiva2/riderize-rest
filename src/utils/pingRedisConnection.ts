import redis from "../http/lib/redis";

export default async function pingRedisConnection() {
  try {
    const redisPing = await redis.ping();

    if (redisPing === "PONG") {
      console.log("Redis connected on port: " + process.env.REDIS_PORT);
    }
  } catch (e) {
    console.error("Error while connecting with Redis...", e);
  }
}

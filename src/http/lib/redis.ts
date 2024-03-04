import { Redis } from "ioredis";
import "dotenv/config";

const redis = new Redis({
  port: +process.env.REDIS_PORT!,
  host: process.env.REDIS_HOST,
});

console.log({
  port: +process.env.REDIS_PORT!,
  host: process.env.REDIS_HOST,
});

export default redis;

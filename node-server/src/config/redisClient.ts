import * as redis from "redis";
import { AppError } from "middlewares/errorHandler.js";

const redisClient: redis.RedisClientType = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB_NUM}`,
});

(async () => {
  try {
    await redisClient.connect();

    console.log("Redis connected");
  } catch (err) {
    console.log(err);

    console.error("Redis connection failed 1/2");

    console.log("Retrying...");
    try {
      await redisClient.connect();

      console.log("Redis connected");
    } catch (err) {
      console.error("Redis connection failed");

      throw new AppError("Redis connection error", 500);
    }
  }
})();

export default redisClient;

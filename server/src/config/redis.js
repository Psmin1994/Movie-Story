import redis from "redis";

const redisClient = redis.createClient({
  // url: "redis://default:java1994@redis-15671.c276.us-east-1-2.ec2.cloud.redislabs.com:15671",
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB_NUM}`,
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Failed to connect to Redis");

    console.log("Retrying...");

    try {
      await redisClient.connect();
      console.log("Redis connected");
    } catch (err) {
      console.error("Failed to connect to Redis");

      throw err;
    }
  }
})();

export default redisClient;

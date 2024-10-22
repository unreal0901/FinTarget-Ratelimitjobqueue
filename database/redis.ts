import Redis from "ioredis";
import config from "../config/config";

const redisClient = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
  maxRetriesPerRequest: null,
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("end", () => {
  console.log("Redis connection closed.");
});

export default redisClient;

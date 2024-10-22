import { Worker, Job } from "bullmq";
import fs from "fs";
import redisClient from "../../database/redis";
import { setupLogging } from "../../utils/CreateLogs";
import { taskQueue } from ".";

export const taskWorker = () => {
  const logFile = setupLogging();
  async function task(user_id: string) {
    console.log(`Processing task for User ID: ${user_id}`);
    const logMessage = `Task completed for User ID: ${user_id} at ${new Date().toISOString()}\n`;
    fs.appendFileSync(logFile, logMessage);
  }

  const worker = new Worker(
    "tasks",
    async (job: Job) => {
      const { userId } = job.data;
      const now = Date.now();
      const userRateLimitKey = `user:${userId}:rate-limit`;
      const userRateLimit = await redisClient.hgetall(userRateLimitKey);
      const userCount = userRateLimit.count
        ? parseInt(userRateLimit.count, 10)
        : 0;
      const lastProcessed = userRateLimit.lastProcessed
        ? parseInt(userRateLimit.lastProcessed, 10)
        : 0;

      console.log("User count is :", userCount, now, lastProcessed);
      if (now - lastProcessed < 1000) {
        console.log(
          `Rate limit exceeded for User ID: ${userId}. Job will be queued.`
        );
        await taskQueue.add("user-task", job.data, { delay: 2000 });
        return;
      }

      if (now - lastProcessed > 60000) {
        await redisClient.hset(userRateLimitKey, "count", 1);
        await task(userId);
        await redisClient.hset(userRateLimitKey, "lastProcessed", now);
      } else if (userCount < 19) {
        await redisClient.hincrby(userRateLimitKey, "count", 1);
        await task(userId);
        await redisClient.hset(userRateLimitKey, "lastProcessed", now);
      } else {
        console.log(
          `Rate limit exceeded for User ID: ${userId}. Job will be queued.`
        );
        await taskQueue.add("user-task", job.data, { delay: 2000 });
      }
    },
    {
      connection: redisClient,
    }
  );

  worker.on("ready", () => {
    console.log("Worker is ready and listening for jobs.");
  });

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} has been completed!`);
  });

  worker.on("failed", (job, err) => {
    if (job) {
      console.error(`Job ${job.id} has failed: ${err.message}`);
    }
  });
};

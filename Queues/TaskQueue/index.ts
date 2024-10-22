import { Queue } from 'bullmq';
import redisClient from '../../database/redis';
export const taskQueue = new Queue('tasks', {
  connection: redisClient,
});

import { taskQueue } from "../../Queues/TaskQueue";

export class UserTaskService {
  public addTask = async (userId: string): Promise<void> => {
    await taskQueue.add("user-task", { userId });
  };
}

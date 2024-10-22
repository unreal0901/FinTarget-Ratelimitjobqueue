import { Request, Response } from "express";
import { UserTaskService } from "./UserTask.service";
import { IResponse } from "../../types/GenericReponse";

export class UserTaskController {
  private userTaskService: UserTaskService;
  constructor() {
    this.userTaskService = new UserTaskService();
  }
  public createTask = async (req: Request, res: Response<IResponse>) => {
    const userId = req.body.user_id;
    try {
      await this.userTaskService.addTask(userId);
      res.status(200).json({
        message: "Task added to queue successfully.",
        error: false,
        status: "OK",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error adding task to queue.",
        error: true,
        status: "FAILED",
      });
    }
  };
}

const userTaskControllerInstance = new UserTaskController();
export default userTaskControllerInstance;

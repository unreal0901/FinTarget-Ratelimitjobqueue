import express from "express";
const router = express.Router();
import userTaskController from "./UserTask.controller";

router.post("/", userTaskController.createTask);

export default router;

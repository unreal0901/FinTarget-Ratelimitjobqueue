import HealthRoutes from "../../src/health/routes";
import userTask_routes from "../../src/UserTask/routes"
import express from "express";
const router = express.Router();

router.use("/status", HealthRoutes);
router.use('/task',userTask_routes);

export default router;

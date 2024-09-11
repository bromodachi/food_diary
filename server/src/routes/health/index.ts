import express from "express";
import { HealthController } from "../../controller";

const router = express.Router();

const healthController = new HealthController();

router.get("/", healthController.health);

export default router;

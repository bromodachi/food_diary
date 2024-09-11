import { Router } from "express";
import health from "./health";
import diary from "./diary";
import bodyParser from "body-parser";

let router = Router();

router.use("/health", health);
router.use("/diary", bodyParser.json(), diary);

export default router;

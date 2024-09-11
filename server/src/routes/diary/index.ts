import express from "express";
import { DiaryController } from "../../controller";
import { DiaryServiceImpl } from "../../services/DiaryServiceImpl";
import { InMemoryDiaryRepository } from "../../repository/InMemoryDiaryRepository";
import { validateRequest } from "../../middleware/ValidationMiddleware";
import {
  createUserEntriesSchema,
  getUserEntriesSchema,
  updateUserEntriesSchema,
} from "../../schemas/DiarySchemas";

const router = express.Router();

const diaryRepo = new InMemoryDiaryRepository();
const diaryService = new DiaryServiceImpl(diaryRepo);
const diaryController = new DiaryController(diaryService);

router.get(
  "/entries",
  validateRequest("query", getUserEntriesSchema),
  diaryController.getEntries,
);
router.post(
  "/entries",
  validateRequest("body", createUserEntriesSchema),
  diaryController.createEntry,
);
router.delete("/entries/:id", diaryController.delete);
router.patch(
  "/entries/:id",
  validateRequest("body", updateUserEntriesSchema),
  diaryController.updateEntry,
);

export default router;

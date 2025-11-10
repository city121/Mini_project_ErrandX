import express from "express";
import { getCommentsByTask } from "../controllers/comment.controller.js";

const router = express.Router();

// 🟢 Route to get comments for a task
router.get("/:taskId", getCommentsByTask);

export default router;

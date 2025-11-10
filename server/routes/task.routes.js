import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import * as taskController from "../controllers/task.controller.js";

const router = express.Router();

// All task routes are protected by the middleware
router.get("/", protect, taskController.getTasks);
router.get("/:id", protect, taskController.getTask);
router.post("/", protect, taskController.createTask);
router.put("/:id", protect, taskController.updateTask);
router.delete("/:id", protect, taskController.deleteTask);

router.put("/:id/claim", protect, taskController.claimTask);
router.put("/:id/unclaim", protect, taskController.unclaimTask);

export default router;
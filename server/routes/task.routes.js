import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import * as taskController from "../controllers/task.controller.js";

const router = express.Router();

// Apply 'protect' middleware to all task routes
router.use(protect);

router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTask);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Custom Claim/Unclaim routes
router.put("/:id/claim", taskController.claimTask);
router.put("/:id/unclaim", taskController.unclaimTask);

export default router;
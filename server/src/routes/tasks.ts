import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Protect all task routes
router.use(authenticateToken);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;

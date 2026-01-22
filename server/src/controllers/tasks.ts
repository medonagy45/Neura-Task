import { Request, Response } from "express";
import Task, { ITask } from "../models/Task";
import { AuthRequest } from "../middleware/auth";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }
    const tasks = await Task.find({ user: userId }).sort({
      order: 1,
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const userId = (req as AuthRequest).user?.id;

    // Simple validation
    if (!title || !dueDate) {
      return res
        .status(400)
        .json({ message: "Title and Due Date are required" });
    }

    // Validate due date is not in the past
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    
    if (dueDateObj < today) {
      return res
        .status(400)
        .json({ message: "Due date must be today or in the future" });
    }

    const newTask = new Task({
      user: userId,
      title,
      description,
      dueDate,
      status: status || "todo",
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = (req as AuthRequest).user?.id;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      updates,
      {
        new: true,
      },
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.id;

    const deletedTask = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
};

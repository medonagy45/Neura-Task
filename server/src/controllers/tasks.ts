import { Request, Response } from "express";
import Task, { ITask } from "../models/Task";
import { AuthRequest } from "../middleware/auth";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const tasks = await Task.find({ user: userId }).sort({
      order: 1,
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
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
    res.status(500).json({ message: "Error creating task", error });
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
    res.status(500).json({ message: "Error updating task", error });
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
    res.status(500).json({ message: "Error deleting task", error });
  }
};

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found" });
        }
        const tasks = yield Task_1.default.find({ user: userId }).sort({
            order: 1,
            createdAt: -1,
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, dueDate, status } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const newTask = new Task_1.default({
            user: userId,
            title,
            description,
            dueDate,
            status: status || "todo",
        });
        const savedTask = yield newTask.save();
        res.status(201).json(savedTask);
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error creating task" });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updatedTask = yield Task_1.default.findOneAndUpdate({ _id: id, user: userId }, updates, {
            new: true,
        });
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(updatedTask);
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Error updating task" });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const deletedTask = yield Task_1.default.findOneAndDelete({ _id: id, user: userId });
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Error deleting task" });
    }
});
exports.deleteTask = deleteTask;

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import client from "../../api/client";
import type { Task, CreateTaskData, UpdateTaskData } from "../../types";
import { logout } from "../auth/authSlice";

interface TasksState {
  items: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await client.get<Task[]>("/tasks");
  return response.data;
});

export const addNewTask = createAsyncThunk(
  "tasks/addNewTask",
  async (initialTask: CreateTaskData) => {
    const response = await client.post<Task>("/tasks", initialTask);
    return response.data;
  },
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, updates }: { id: string; updates: UpdateTaskData }) => {
    const response = await client.put<Task>(`/tasks/${id}`, updates);
    return response.data;
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string) => {
    await client.delete(`/tasks/${id}`);
    return id;
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    moveTaskOptimistically: (
      state,
      action: PayloadAction<{
        id: string;
        status: Task["status"];
        order?: number;
      }>,
    ) => {
      const { id, status, order } = action.payload;
      const task = state.items.find((t) => t._id === id);
      if (task) {
        task.status = status;
        if (order !== undefined) {
          task.order = order;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.items = [];
        state.status = "idle";
        state.error = null;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      });
  },
});

export const { moveTaskOptimistically } = tasksSlice.actions;
export default tasksSlice.reducer;

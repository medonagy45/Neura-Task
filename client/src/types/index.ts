export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string; // ISO date string from backend
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate: string;
  status?: "todo" | "in-progress" | "done";
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: "todo" | "in-progress" | "done";
  order?: number;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate: string;
  status?: "todo" | "in-progress" | "done";
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  dueDate?: string;
  order?: number;
}

export interface AuthData {
  username: string;
  password?: string;
}

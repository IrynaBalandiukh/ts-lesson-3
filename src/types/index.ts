import type { Priority, Status, Task } from "../dto/Task";

export type CreateTaskInput = Omit<Task, "id" | "createdAt">;

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type TaskFilters = {
  status?: Status | Status[];
  priority?: Priority | Priority[];
  createdAt?: Date;
};

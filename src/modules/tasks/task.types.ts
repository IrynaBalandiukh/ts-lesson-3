import type { ISSUE_TYPES, PRIORITIES, STATUSES } from "../../constants.js";

export type Status = (typeof STATUSES)[keyof typeof STATUSES];
export type Priority = (typeof PRIORITIES)[keyof typeof PRIORITIES];
export type IssueType = (typeof ISSUE_TYPES)[keyof typeof ISSUE_TYPES];

export type TaskDTO = {
  id: number;
  title: string;
  createdAt: Date;

  description?: string;
  status?: Status;
  priority?: Priority;
  deadline?: Date;
};

export type CreateTaskInput = Omit<TaskDTO, "id" | "createdAt">;

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type TaskFilters = {
  status?: Status | Status[];
  priority?: Priority | Priority[];
  createdAt?: Date;
};

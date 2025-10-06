import type { PRIORITIES, STATUSES } from "../constants.js";

export type Status = (typeof STATUSES)[keyof typeof STATUSES];
export type Priority = (typeof PRIORITIES)[keyof typeof PRIORITIES];

export type Task = {
  id: number;
  title: string;
  createdAt: Date;

  description?: string;
  status?: Status;
  priority?: Priority;
  deadline?: Date;
};

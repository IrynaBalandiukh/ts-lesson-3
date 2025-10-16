import { PRIORITIES, STATUSES } from "../constants";
import type { Priority, Status } from "../modules/tasks/task.types";

const statusValues = Object.values(STATUSES) as readonly Status[];
const priorityValues = Object.values(PRIORITIES) as readonly Priority[];

export const isStatus = (value: unknown): value is Status =>
  statusValues.includes(value as Status);
export const isPriority = (value: unknown): value is Priority =>
  priorityValues.includes(value as Priority);

export const isString = (value: unknown): value is string =>
  typeof value === "string";
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

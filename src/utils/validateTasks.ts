import { STATUSES, PRIORITIES } from "../constants";
import type { Task, Status, Priority } from "../dto/Task.ts";

const statusValues = Object.values(STATUSES) as readonly Status[];
const priorityValues = Object.values(PRIORITIES) as readonly Priority[];

const isStatus = (value: unknown): value is Status =>
  statusValues.includes(value as Status);
const isPriority = (value: unknown): value is Priority =>
  priorityValues.includes(value as Priority);

const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number";

function normalizeTask(task: any, index: number): Task {
  const hasValidBase =
    isNumber(task?.id) &&
    isString(task?.title) &&
    task?.createdAt instanceof Date;

  if (!hasValidBase) {
    console.warn(`Invalid task structure at index ${index + 1}`);
  }

  if (task.description !== undefined && typeof task.description !== "string") {
    console.warn(
      `The "description" field in task #${index + 1} must be of type string`
    );
  }

  if (task.deadline !== undefined && !(task.deadline instanceof Date)) {
    console.warn(
      `The "deadline" field in task #${index + 1} must be of type Date`
    );
  }

  const status: Status = isStatus(task?.status) ? task.status : STATUSES.TODO;
  const priority: Priority = isPriority(task?.priority)
    ? task.priority
    : PRIORITIES.MEDIUM;

  return {
    id: task?.id,
    title: task?.title,
    createdAt: task?.createdAt,
    description: task?.description,
    status,
    priority,
    deadline: task?.deadline,
  };
}

export function validateTasks(data: unknown): Task[] {
  if (!Array.isArray(data)) {
    console.warn("Invalid data format in JSON.");
    return [];
  }
  return data.map(normalizeTask);
}

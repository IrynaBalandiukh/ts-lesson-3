import { STATUSES, PRIORITIES } from "../constants";
import type { TaskDTO, Status, Priority } from "../modules/tasks/task.types";
import { isNumber, isPriority, isStatus, isString } from "./helpers";

function normalizeTask(task: unknown, index: number): TaskDTO {
  const obj =
    typeof task === "object" && task !== null
      ? (task as Record<string, unknown>)
      : undefined;

  const hasValidBase =
    !!obj &&
    "id" in obj &&
    isNumber(obj.id) &&
    "title" in obj &&
    isString(obj.title) &&
    "createdAt" in obj &&
    obj.createdAt instanceof Date;

  if (!hasValidBase) {
    console.warn(`Invalid task structure at index ${index + 1}`);
    throw new Error(`Task at index ${index + 1} has invalid base fields`);
  }

  if (
    "description" in obj &&
    obj.description !== undefined &&
    typeof obj.description !== "string"
  ) {
    console.warn(
      `The "description" field in task #${index + 1} must be of type string`
    );
  }

  if (
    "deadline" in obj &&
    obj.deadline !== undefined &&
    !(obj.deadline instanceof Date)
  ) {
    console.warn(
      `The "deadline" field in task #${index + 1} must be of type Date`
    );
  }

  const status: Status =
    "status" in obj && isStatus(obj.status)
      ? (obj.status as Status)
      : STATUSES.TODO;

  const priority: Priority =
    "priority" in obj && isPriority(obj.priority)
      ? (obj.priority as Priority)
      : PRIORITIES.MEDIUM;

  return {
    id: obj.id as number,
    title: (obj.title as string).trim(),
    createdAt: obj.createdAt as Date,
    description:
      "description" in obj && typeof obj.description === "string"
        ? (obj.description as string).trim()
        : undefined,
    status,
    priority,
    deadline:
      "deadline" in obj && obj.deadline instanceof Date
        ? (obj.deadline as Date)
        : undefined,
  };
}

export function validateTasks(data: unknown): TaskDTO[] {
  if (!Array.isArray(data)) {
    console.warn("Invalid data format in JSON.");
    return [];
  }
  return data.map(normalizeTask);
}

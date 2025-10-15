import { STATUSES, PRIORITIES } from "../constants";
import type { Task, Status, Priority } from "../dto/Task";
import type { CreateTaskInput, UpdateTaskInput, TaskFilters } from "../types";
import { isPriority, isStatus } from "./helpers";

export function getTaskById(tasks: Task[], id: Task["id"]): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function createTask(tasks: Task[], input: CreateTaskInput): Task {
  const id =
    tasks.length > 0 ? Math.max(...tasks.map((t) => Number(t.id))) + 1 : 1;

  const status: Status = isStatus(input.status) ? input.status : STATUSES.TODO;
  const priority: Priority = isPriority(input.priority)
    ? input.priority
    : PRIORITIES.MEDIUM;
  const createdAt = new Date();

  const newTask: Task = {
    id,
    title: input.title,
    createdAt,
    description: input.description ?? "",
    status,
    priority,
    deadline: input?.deadline,
  };

  tasks.push(newTask);

  return newTask;
}

export function updateTask(
  tasks: Task[],
  id: Task["id"],
  patch: UpdateTaskInput
): Task | undefined {
  const taskToUpdate = tasks.find((task) => task.id === id);

  if (!taskToUpdate) {
    console.warn("Task with id ${id} was not found.");
    return;
  }

  const updatedTask: Task = {
    ...taskToUpdate,
    ...patch,
  };

  tasks.map((task) => {
    if (task.id === id) {
      return updatedTask;
    }

    return task;
  });

  return updatedTask;
}

export function deleteTask(tasks: Task[], id: Task["id"]): Task[] {
  return tasks.filter((t) => t.id !== id);
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const hasFilters =
    filters.status !== undefined ||
    filters.priority !== undefined ||
    filters.createdAt !== undefined;

  if (!hasFilters) return tasks;

  return tasks.filter((task) => {
    if (filters.status) {
      const statuses = Array.isArray(filters.status)
        ? filters.status
        : [filters.status];

      if (!task?.status || !statuses.includes(task.status)) return false;
    }

    if (filters.priority) {
      const priorities = Array.isArray(filters.priority)
        ? filters.priority
        : [filters.priority];

      if (!task?.priority || !priorities.includes(task.priority)) return false;
    }

    if (filters.createdAt) {
      const createdAt = new Date(task.createdAt);
      if (createdAt.toDateString() !== filters.createdAt.toDateString()) {
        return false;
      }
    }

    return true;
  });
}

export function isCompletedBeforeDeadline(task: Task): boolean {
  if (!task.deadline) {
    console.warn(`Task "${task.title}" has no deadline.`);
    return false;
  }

  if (task.status !== STATUSES.DONE) {
    console.log(`Task "${task.title}" is not completed yet.`);
    return false;
  }

  const deadline = new Date(task.deadline);
  const now = new Date();

  if (now.getTime() <= deadline.getTime()) {
    console.log(`Task "${task.title}" completed before the deadline.`);
    return true;
  }

  console.log(`Task "${task.title}" was completed after the deadline.`);
  return false;
}

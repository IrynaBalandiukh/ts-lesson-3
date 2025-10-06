import { STATUSES, PRIORITIES, FILTER_OPTIONS } from "../constants";
import type { Task, Status, Priority } from "../dto/Task";

const statusValues = Object.values(STATUSES) as readonly Status[];
const priorityValues = Object.values(PRIORITIES) as readonly Priority[];

const isStatus = (value: unknown): value is Status =>
  statusValues.includes(value as Status);
const isPriority = (value: unknown): value is Priority =>
  priorityValues.includes(value as Priority);

export function getTaskById(tasks: Task[], id: Task["id"]): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt">;

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

  return newTask;
}

export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">>;

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

  return updatedTask;
}

export function deleteTask(tasks: Task[], id: Task["id"]): Task[] {
  return tasks.filter((t) => t.id !== id);
}

export type FilterType = (typeof FILTER_OPTIONS)[keyof typeof FILTER_OPTIONS];
export function filterTasks(
  tasks: Task[],
  filterType: FilterType,
  filterValue: Status | Priority | Date
): Task[] {
  return tasks.filter((task) => {
    switch (filterType) {
      case FILTER_OPTIONS.STATUS:
        return task.status === filterValue;

      case FILTER_OPTIONS.PRIORITY:
        return task.priority === filterValue;

      case FILTER_OPTIONS.CREATED_AT:
        const createdAt = new Date(task.createdAt);
        const filterDate = filterValue as Date;
        return createdAt.toDateString() === filterDate.toDateString();

      default:
        return true;
    }
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

import { PRIORITIES, STATUSES } from "../../constants";
import {
  Priority,
  Status,
  TaskDTO,
  CreateTaskInput,
  TaskFilters,
  UpdateTaskInput,
} from "../../modules/tasks/task.types";
import { isPriority, isStatus } from "../../utils/helpers";
import { validateTasks } from "../../utils/validateTasks";

export class TaskService {
  private tasks: TaskDTO[];

  constructor(tasks: unknown) {
    this.tasks = validateTasks(tasks);
  }

  getTaskById(id: TaskDTO["id"]): TaskDTO | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  createTask(input: CreateTaskInput): TaskDTO {
    const id =
      this.tasks.length > 0
        ? Math.max(...this.tasks.map((t) => Number(t.id))) + 1
        : 1;

    const status: Status | undefined = isStatus(input.status)
      ? input.status
      : STATUSES.TODO;
    const priority: Priority | undefined = isPriority(input.priority)
      ? input.priority
      : PRIORITIES.MEDIUM;
    const createdAt = new Date();

    const newTask: TaskDTO = {
      id,
      title: input.title,
      createdAt,
      description: input.description ?? "",
      status,
      priority,
      deadline: input?.deadline,
    };

    this.tasks.push(newTask);

    return newTask;
  }

  updateTask(id: TaskDTO["id"], patch: UpdateTaskInput): TaskDTO | undefined {
    const taskToUpdate = this.tasks.find((task) => task.id === id);

    if (!taskToUpdate) {
      console.warn("Task with id ${id} was not found.");
      return;
    }

    const updatedTask: TaskDTO = {
      ...taskToUpdate,
      ...patch,
    };

    this.tasks.map((task) => {
      if (task.id === id) {
        return updatedTask;
      }

      return task;
    });

    return updatedTask;
  }

  deleteTask(id: TaskDTO["id"]): TaskDTO[] {
    return this.tasks.filter((t) => t.id !== id);
  }

  filterTasks(filters: TaskFilters): TaskDTO[] {
    const hasFilters =
      filters.status !== undefined ||
      filters.priority !== undefined ||
      filters.createdAt !== undefined;

    if (!hasFilters) return this.tasks;

    return this.tasks.filter((task) => {
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

        if (!task?.priority || !priorities.includes(task.priority))
          return false;
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

  isCompletedBeforeDeadline(id: TaskDTO["id"]): boolean | undefined {
    const taskToCheck = this.tasks.find((task) => task.id === id);

    if (!taskToCheck) {
      return undefined;
    }

    if (!taskToCheck.deadline) {
      console.warn(`Task "${taskToCheck.title}" has no deadline.`);
      return false;
    }

    if (taskToCheck.status !== STATUSES.DONE) {
      console.log(`Task "${taskToCheck.title}" is not completed yet.`);
      return false;
    }

    const deadline = new Date(taskToCheck.deadline);
    const now = new Date();

    if (now.getTime() <= deadline.getTime()) {
      console.log(`Task "${taskToCheck.title}" completed before the deadline.`);
      return true;
    }

    console.log(
      `Task "${taskToCheck.title}" was completed after the deadline.`
    );
    return false;
  }
}

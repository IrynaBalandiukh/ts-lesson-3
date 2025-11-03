import { ISSUE_TYPES, PRIORITIES, STATUSES } from "../../constants";
import { Bug } from "../../models/bug.model";
import { Epic } from "../../models/epic.model";
import { Story } from "../../models/story.model";
import { Subtask } from "../../models/subtask.model";
import { Task, TaskBase } from "../../models/task.model";
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

    const createdAt = new Date();

    const status: Status = isStatus(input.status)
      ? input.status
      : STATUSES.TODO;
    const priority: Priority = isPriority(input.priority)
      ? input.priority
      : PRIORITIES.MEDIUM;
    const type = input.type ?? ISSUE_TYPES.TASK;

    const base = {
      id,
      title: input.title,
      createdAt,
      description: input.description ?? "",
      status,
      priority,
      deadline: input.deadline,
    };

    switch (type) {
      case ISSUE_TYPES.SUBTASK: {
        if (typeof input.parentId !== "number" || input.parentId <= 0) {
          throw new Error("parentId is required and must be > 0 for Subtask");
        }
        const instance = new Subtask({
          ...base,
          parentId: input.parentId,
          isBlocked: !!input.isBlocked,
        });

        const newTask: TaskDTO = {
          ...base,
          type,
          parentId: instance.parentId,
          isBlocked: instance.isBlocked,
        };

        this.tasks.push(newTask);
        return newTask;
      }

      case ISSUE_TYPES.STORY: {
        if (typeof input.storyPoints !== "number" || input.storyPoints <= 0) {
          throw new Error("storyPoints is required and must be > 0 for Story");
        }
        if (
          typeof input.businessValue !== "number" ||
          input.businessValue <= 0
        ) {
          throw new Error(
            "businessValue is required and must be > 0 for Story"
          );
        }
        const instance = new Story({
          ...base,
          storyPoints: input.storyPoints,
          businessValue: input.businessValue,
        });

        const newTask: TaskDTO = {
          ...base,
          type,
          storyPoints: instance.storyPoints,
          businessValue: instance.businessValue,
        };

        this.tasks.push(newTask);
        return newTask;
      }

      case ISSUE_TYPES.EPIC: {
        if (typeof input.owner !== "string" || input.owner.trim() === "") {
          throw new Error("owner is required for Epic");
        }
        if (!(input.releaseDate instanceof Date)) {
          throw new Error("releaseDate must be a Date for Epic");
        }
        const instance = new Epic({
          ...base,
          owner: input.owner.trim(),
          releaseDate: input.releaseDate,
        });

        const newTask: TaskDTO = {
          ...base,
          type,
          owner: instance.owner,
          releaseDate: instance.releaseDate,
        };

        this.tasks.push(newTask);
        return newTask;
      }

      case ISSUE_TYPES.BUG: {
        if (
          typeof input.environment !== "string" ||
          input.environment.trim() === ""
        ) {
          throw new Error("environment is required for Bug");
        }
        if (
          typeof input.stepsToReproduce !== "string" ||
          input.stepsToReproduce.trim() === ""
        ) {
          throw new Error("stepsToReproduce is required for Bug");
        }
        const instance = new Bug({
          ...base,
          environment: input.environment.trim(),
          stepsToReproduce: input.stepsToReproduce.trim(),
        });

        const newTask: TaskDTO = {
          ...base,
          type,
          environment: instance.environment,
          stepsToReproduce: instance.stepsToReproduce,
        };

        this.tasks.push(newTask);
        return newTask;
      }

      case ISSUE_TYPES.TASK:
      default: {
        const instance = new Task(base);

        const newTask: TaskDTO = {
          ...base,
          type,
        };

        this.tasks.push(newTask);
        return newTask;
      }
    }
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

    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        return updatedTask;
      }

      return task;
    });

    return updatedTask;
  }

  deleteTask(id: TaskDTO["id"]): TaskDTO[] {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks;
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

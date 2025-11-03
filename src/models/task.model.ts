import { ISSUE_TYPES } from "../constants";
import {
  IssueType,
  Priority,
  Status,
  TaskDTO,
} from "../modules/tasks/task.types";

export class TaskBase {
  id: number;
  title: string;
  createdAt: Date;
  description?: string;
  status?: Status;
  priority?: Priority;
  deadline?: Date;

  constructor({
    id,
    title,
    createdAt,
    description,
    status,
    priority,
    deadline,
  }: TaskDTO) {
    if (id <= 0) {
      throw new Error("id must be a positive number");
    }

    if (title.trim() === "") {
      throw new Error("title cannot be empty");
    }

    const createdDateOnly = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
    );

    const todayDateOnly = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );

    if (createdDateOnly < todayDateOnly) {
      throw new Error("Task cannot be created with a past date");
    }

    this.id = id;
    this.title = title.trim();
    this.createdAt = createdAt;
    this.description = description?.trim();
    this.status = status;
    this.priority = priority;
    this.deadline = deadline;
  }

  getTaskInfo() {
    return {
      title: this.title,
      status: this.status,
      priority: this.priority,
      deadline: this.deadline,
    };
  }
}

export class Task extends TaskBase {
  type: IssueType = ISSUE_TYPES.TASK;

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: this.type,
    };
  }
}

import { ISSUE_TYPES } from "../constants";
import {
  IssueType,
  Priority,
  Status,
  TaskDTO,
} from "../modules/tasks/task.types";
import { validateTask } from "../utils/validateTask";

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
    validateTask({
      id,
      title,
      createdAt,
      description,
      status,
      priority,
      deadline,
    });

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

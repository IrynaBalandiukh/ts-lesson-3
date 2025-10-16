import { ISSUE_TYPES, PRIORITIES, STATUSES } from "../../constants";
import {
  Priority,
  Status,
  TaskDTO,
  IssueType,
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

export class Subtask extends TaskBase {
  type: IssueType = ISSUE_TYPES.SUBTASK;
  parentId: number;
  isBlocked: boolean;

  constructor(
    props: TaskDTO & {
      parentId: number;
      isBlocked?: boolean;
    }
  ) {
    super(props);

    if (props.parentId <= 0) {
      throw new Error("parentId must be a positive number");
    }

    if (props.parentId === props.id) {
      throw new Error("Subtask cannot have itself as a parent");
    }

    if (props.isBlocked && props.status === STATUSES.DONE) {
      throw new Error("Blocked subtask cannot have status 'done'");
    }

    this.parentId = props.parentId;
    this.isBlocked = props.isBlocked ?? false;
  }

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: this.type,
      parentId: this.parentId,
      isBlocked: this.isBlocked,
    };
  }
}

export class Bug extends TaskBase {
  type: IssueType = ISSUE_TYPES.BUG;
  environment: string;
  stepsToReproduce: string;

  constructor(
    props: TaskDTO & {
      environment: string;
      stepsToReproduce: string;
    }
  ) {
    super(props);

    if (props.environment.trim() === "") {
      throw new Error("environment cannot be empty");
    }

    if (props.stepsToReproduce.trim() === "") {
      throw new Error("stepsToReproduce cannot be empty if provided");
    }

    this.environment = props.environment;
    this.stepsToReproduce = props.stepsToReproduce;
  }

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: this.type,
      environment: this.environment,
      stepsToReproduce: this.stepsToReproduce,
    };
  }
}

export class Story extends TaskBase {
  type: IssueType = ISSUE_TYPES.STORY;
  storyPoints: number;
  businessValue: number;

  constructor(
    props: TaskDTO & {
      storyPoints: number;
      businessValue: number;
    }
  ) {
    super(props);

    if (props.storyPoints <= 0) {
      throw new Error("StoryPoints must be a positive number");
    }

    if (props.businessValue <= 0) {
      throw new Error("BusinessValue must be a positive number");
    }

    this.storyPoints = props.storyPoints ?? 1;
    this.businessValue = props.businessValue ?? 1;
  }

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: this.type,
      storyPoints: this.storyPoints,
      businessValue: this.businessValue,
    };
  }
}

export class Epic extends TaskBase {
  type: IssueType = ISSUE_TYPES.EPIC;
  owner: string;
  releaseDate?: Date;

  constructor(
    props: TaskDTO & {
      owner: string;
      releaseDate: Date;
    }
  ) {
    super(props);

    if (props.owner.trim() === "") {
      throw new Error("Owner cannot be empty");
    }

    this.owner = props.owner?.trim();
    this.releaseDate = props.releaseDate;
  }

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: this.type,
      owner: this.owner,
      releaseDate: this.releaseDate,
    };
  }
}

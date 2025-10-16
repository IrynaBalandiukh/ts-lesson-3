import {
  TaskDTO,
  CreateTaskInput,
  TaskFilters,
  UpdateTaskInput,
} from "./task.types";
import { TaskService } from "./task.service";

export class TaskController {
  constructor(private readonly service: TaskService) {}

  getTaskById(id: TaskDTO["id"]): TaskDTO | undefined {
    return this.service.getTaskById(id);
  }

  createTask(input: CreateTaskInput): TaskDTO {
    return this.service.createTask(input);
  }

  updateTask(id: TaskDTO["id"], patch: UpdateTaskInput): TaskDTO | undefined {
    return this.service.updateTask(id, patch);
  }

  deleteTask(id: TaskDTO["id"]): TaskDTO[] {
    return this.service.deleteTask(id);
  }

  filterTasks(filters: TaskFilters): TaskDTO[] {
    return this.service.filterTasks(filters);
  }

  isCompletedBeforeDeadline(id: TaskDTO["id"]): boolean | undefined {
    return this.service.isCompletedBeforeDeadline(id);
  }
}

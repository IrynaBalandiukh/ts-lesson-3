import { PRIORITIES, STATUSES } from "./constants";
import tasks from "./data/tasks.json";
import { TaskController } from "./modules/tasks/task.contoller";
import { TaskService } from "./modules/tasks/task.service";

const tasksService = new TaskService(tasks);

const tasksController = new TaskController(tasksService);

const taskById = tasksController.getTaskById(3);
console.log("taskById", taskById);

const newTask = tasksController.createTask({
  title: "Add styles",
});
console.log("newTask", newTask);

const updatedTaskById = tasksController.updateTask(4, {
  title: "Add documentation",
});
console.log("updatedTaskById", updatedTaskById);

const tasksAfterDeletion = tasksController.deleteTask(1);
console.log("tasksAfterDeletion", tasksAfterDeletion);

const filteredByStatus = tasksController.filterTasks({
  status: STATUSES.DONE,
});
console.log("Tasks filtered by status done:", filteredByStatus);

const filteredByPriority = tasksController.filterTasks({
  priority: PRIORITIES.HIGH,
});
console.log("Tasks filtered by priority high:", filteredByPriority);

const filterDate = new Date("2025-09-28");
const filteredByDate = tasksController.filterTasks({
  createdAt: filterDate,
});
console.log("Tasks filtered by createdAt 2025-09-28:", filteredByDate);

const result = tasksController.isCompletedBeforeDeadline(8);
console.log("Result:", result);

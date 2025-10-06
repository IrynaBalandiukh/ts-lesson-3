import { FILTER_OPTIONS, PRIORITIES, STATUSES } from "./constants";
import tasks from "./data/tasks.json";
import {
  createTask,
  deleteTask,
  filterTasks,
  getTaskById,
  isCompletedBeforeDeadline,
  updateTask,
} from "./utils/helpers";
import { validateTasks } from "./utils/validateTasks";

const validatedTasks = validateTasks(tasks);
console.log("validatedTasks", validatedTasks);

const taskById = getTaskById(validatedTasks, 3);
console.log("taskById", taskById);

const newTask = createTask(validatedTasks, { title: "Add styles" });
console.log("newTask", newTask);

const updatedTaskById = updateTask(validatedTasks, 4, {
  title: "Add documentation",
});
console.log("updatedTaskById", updatedTaskById);

const tasksAfterDeletion = deleteTask(validatedTasks, 1);
console.log("tasksAfterDeletion", tasksAfterDeletion);

const filteredByStatus = filterTasks(
  validatedTasks,
  FILTER_OPTIONS.STATUS,
  STATUSES.DONE
);
console.log("Tasks filtered by status done:", filteredByStatus);

const filteredByPriority = filterTasks(
  validatedTasks,
  FILTER_OPTIONS.PRIORITY,
  PRIORITIES.HIGH
);
console.log("Tasks filtered by priority high:", filteredByPriority);

const filterDate = new Date("2025-09-28");
const filteredByDate = filterTasks(
  validatedTasks,
  FILTER_OPTIONS.CREATED_AT,
  filterDate
);
console.log("Tasks filtered by createdAt 2025-09-28:", filteredByDate);

const taskToCheck = validatedTasks[8];

if (taskToCheck) {
  const result = isCompletedBeforeDeadline(taskToCheck);
  console.log("Result:", result);
}

import { TaskDTO } from "../modules/tasks/task.types";

export function validateTask({ id, title, createdAt }: TaskDTO) {
  if (id <= 0) {
    throw new Error("Id must be a positive number");
  }

  if (title.trim() === "") {
    throw new Error("Title cannot be empty");
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
}

export const STATUSES = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
} as const;

export const PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const ISSUE_TYPES = {
  TASK: "Task",
  SUBTASK: "Subtask",
  BUG: "Bug",
  STORY: "Story",
  EPIC: "Epic",
};

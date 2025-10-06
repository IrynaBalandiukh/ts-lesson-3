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

export const FILTER_OPTIONS = {
  CREATED_AT: "createdAt",
  PRIORITY: "priority",
  STATUS: "status",
} as const;

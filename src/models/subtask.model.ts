import { ISSUE_TYPES, STATUSES } from "../constants";
import { IssueType, TaskDTO } from "../modules/tasks/task.types";
import { TaskBase } from "./task.model";

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

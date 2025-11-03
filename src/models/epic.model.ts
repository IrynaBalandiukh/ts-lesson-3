import { ISSUE_TYPES } from "../constants";
import { IssueType, TaskDTO } from "../modules/tasks/task.types";
import { TaskBase } from "./task.model";

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

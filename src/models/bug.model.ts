import { ISSUE_TYPES } from "../constants";
import { IssueType, TaskDTO } from "../modules/tasks/task.types";
import { TaskBase } from "./task.model";

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

import { ISSUE_TYPES } from "../constants";
import { IssueType, TaskDTO } from "../modules/tasks/task.types";
import { TaskBase } from "./task.model";

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

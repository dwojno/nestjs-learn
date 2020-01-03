import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TasksStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses: TasksStatus[] = [
    TasksStatus.DONE,
    TasksStatus.IN_PROGRESS,
    TasksStatus.OPEN
  ];
  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not valid status`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}

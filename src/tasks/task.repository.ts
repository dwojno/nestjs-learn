import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { TasksStatus } from './task.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(
    { description, title }: CreateTaskDto,
    user: User
  ): Promise<Task> {
    const task = new Task();
    task.description = description;
    task.title = title;
    task.status = TasksStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;
    return task;
  }

  async getTasks(
    { status, search }: GetTasksFilterDto,
    user: User
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id })
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title ILIKE :search OR task.description ILIKE :search',
        {
          search: `%${search}`
        }
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
}

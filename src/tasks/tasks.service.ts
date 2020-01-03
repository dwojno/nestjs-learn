import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksStatus } from './task.model';
import { CreateTaskDto } from './dto/createTask.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {}

  async getTasks(filterData: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterData, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id }
    });
    if (!found) {
      throw new NotFoundException(`Task of an id "${id}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const removed = await this.taskRepository.delete({ id, userId: user.id });
    if (!removed.affected) {
      throw new NotFoundException();
    }
  }

  async updateTaskStatus(
    id: number,
    status: TasksStatus,
    user: User
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}

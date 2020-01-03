import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Query,
  UseGuards
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksStatus } from './task.model';
import { CreateTaskDto } from './dto/createTask.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks(
    @Query(ValidationPipe) filterData: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    return this.taskService.getTasks(filterData, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
    ): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TasksStatus,
    @GetUser() user: User
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
    ): Promise<void> {
    return this.taskService.deleteTaskById(id, user);
  }
}

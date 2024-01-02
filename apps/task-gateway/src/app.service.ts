/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/auth.dto';
import { firstValueFrom } from 'rxjs';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskEvent } from './events/createTaskEvent';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskEvent } from './events/updateTaskEvent';
import { MarkTaskAsComplete } from './events/markCompleteTaskEvent';
import { CreateUserEvent } from './events/userEvent';

@Injectable()
export class AppService {
  constructor(
    @Inject('USERS_PROXY') private readonly usersMicroservice: ClientProxy,
    @Inject('TASKS_PROXY') private readonly tasksMicroservice: ClientProxy,
  ) {}

  async getUserRoleById(id: string, field: string) {
    return await firstValueFrom(
      this.usersMicroservice.send(
        { cmd: 'getUserRoleById' },
        {
          id: id,
          field: field,
        },
      ),
    );
  }

  async registerUser(registerUserRequest: RegisterDto) {
    const existingUser = await firstValueFrom(
      this.usersMicroservice.send(
        { cmd: 'getUserEmail' },
        {
          email: registerUserRequest.email,
        },
      ),
    );

    if (existingUser) {
      throw new Error('User already exists');
    }

    this.usersMicroservice.emit(
      'user_created',
      new CreateUserEvent(
        registerUserRequest.username,
        registerUserRequest.email,
        registerUserRequest.type,
      ),
    );
  }

  async authenticateUser(email: string, password: string, headers) {
    const user = await firstValueFrom(
      this.usersMicroservice.send(
        { cmd: 'getUserEmail' },
        {
          email: email,
        },
      ),
    );
    if (!user) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getAllUsers() {
    return await firstValueFrom(
      this.usersMicroservice.send({ cmd: 'getAllUsers' }, {}),
    );
  }

  async createTask(newTask: CreateTaskDto) {
    const existingTask = await firstValueFrom(
      this.tasksMicroservice.send(
        { cmd: 'getTaskByTitle' },
        {
          title: newTask.title,
        },
      ),
    );

    if (existingTask) {
      throw new Error('Task already exists');
    }

    return this.tasksMicroservice.emit(
      'task_created',
      new CreateTaskEvent(
        newTask.user,
        newTask.title,
        newTask.description,
        newTask.priority,
        newTask.dueDate,
        newTask.isComplete,
      ),
    );
  }

  async updateTask(id: string, updateTask: UpdateTaskDto) {
    const task = await firstValueFrom(
      this.tasksMicroservice.send(
        { cmd: 'getTaskById' },
        {
          id: id,
        },
      ),
    );

    if (!task) {
      throw new Error('Task not found');
    }

    return this.tasksMicroservice.emit(
      'task_updated',
      new UpdateTaskEvent(
        id,
        updateTask.title,
        updateTask.description,
        updateTask.priority,
        updateTask.dueDate,
        updateTask.isComplete,
      ),
    );
  }

  async findTasks(find: string, sortBy: string) {
    return await firstValueFrom(
      this.tasksMicroservice.send(
        { cmd: 'searchTaskAndSort' },
        {
          find: find,
          sortBy: sortBy,
        },
      ),
    );
  }

  async findUserTasks(id: string) {
    return await firstValueFrom(
      this.tasksMicroservice.send(
        { cmd: 'getUserTasks' },
        {
          id: id,
        },
      ),
    );
  }

  async markTaskAsComplete(taskId: string, userId: string) {
    const task = await firstValueFrom(
      this.tasksMicroservice.send(
        { cmd: 'getTaskById' },
        {
          id: taskId,
        },
      ),
    );

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.user.toString() !== userId) {
      throw new Error('You are not authorized to mark this task as complete');
    }

    if (task.isComplete) {
      throw new Error('Task already marked as complete');
    }

    return this.tasksMicroservice.emit(
      'mark_task_as_complete',
      new MarkTaskAsComplete(taskId, userId),
    );
  }
}

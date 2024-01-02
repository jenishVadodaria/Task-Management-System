/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTaskEvent, UpdateTaskEvent } from './events';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern({ cmd: 'getTaskByTitle' })
  findTaskByTitle(@Payload() data) {
    return this.tasksService.findTaskByTitle(data.title);
  }

  @MessagePattern({ cmd: 'getTaskById' })
  findTaskById(@Payload() data) {
    return this.tasksService.findTaskById(data.id);
  }

  @EventPattern('task_created')
  handleTaskCreated(data: CreateTaskEvent) {
    this.tasksService.createTask(data);
  }

  @EventPattern('task_updated')
  handleTaskUpdated(data: UpdateTaskEvent) {
    const { id, ...updateTaskData } = data;

    this.tasksService.updateTask(id, updateTaskData);
  }

  @MessagePattern({ cmd: 'searchTaskAndSort' })
  findTaskBySearch(@Payload() data) {
    return this.tasksService.findTaskBySearch(data.find, data.sortBy);
  }

  @MessagePattern({ cmd: 'getUserTasks' })
  findUserTasks(@Payload() data) {
    return this.tasksService.findUserTasks(data.id);
  }

  @EventPattern('mark_task_as_complete')
  markTaskAsComplete(@Payload() data) {
    return this.tasksService.markTaskAsComplete(data.taskId, data.userId);
  }
}

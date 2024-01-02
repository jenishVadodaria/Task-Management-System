import { Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findTaskByTitle(title: string) {
    return await this.taskRepository.findTaskByTitle(title);
  }

  async findTaskById(id: string) {
    return await this.taskRepository.findOne(id);
  }

  async createTask(task: CreateTaskDto) {
    return await this.taskRepository.create(task);
  }

  async updateTask(id: string, task: UpdateTaskDto) {
    return await this.taskRepository.updateTask(id, task);
  }

  async findTaskBySearch(find: string, sortBy: string) {
    return await this.taskRepository.findTaskBySearch(find, sortBy);
  }

  async findUserTasks(id: string) {
    return await this.taskRepository.findUserTasks(id);
  }

  async markTaskAsComplete(taskId: string, userId: string) {
    return await this.taskRepository.markTaskAsComplete(taskId, userId);
  }
}

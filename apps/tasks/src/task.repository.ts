/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(task: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel(task);
    return newTask.save();
  }

  async updateTask(id: string, task: UpdateTaskDto): Promise<Task> {
    return this.taskModel
      .findOneAndUpdate({ _id: id }, task, { new: true })
      .exec();
  }

  async findTaskBySearch(find: string, sortBy: string): Promise<Task[]> {
    const query = {
      $or: [
        { title: { $regex: `${find}`, $options: 'i' } },
        { description: { $regex: `${find}`, $options: 'i' } },
        { priority: { $regex: `${find}`, $options: 'i' } },
      ],
    };

    return this.taskModel.find(query).sort(sortBy).exec();
  }

  async findOne(id: string): Promise<Task> {
    return this.taskModel.findById(id).exec();
  }

  async remove(id: string): Promise<Task> {
    return this.taskModel.findOneAndDelete({ _id: id }).exec();
  }

  async findByIdAndField(field: string, id: string): Promise<Task> {
    return this.taskModel.findById({ _id: id, field: field }).exec();
  }

  async findTaskByTitle(title: string): Promise<Task> {
    return this.taskModel.findOne({ title: title }).exec();
  }

  async findUserTasks(id: string): Promise<Task[]> {
    return this.taskModel.find({ user: id }).exec();
  }

  async markTaskAsComplete(taskId: string, userId: string) {
    return this.taskModel
      .findOneAndUpdate(
        { _id: taskId, user: userId },
        { $set: { isComplete: true } },
        { new: true },
      )
      .exec();
  }
}

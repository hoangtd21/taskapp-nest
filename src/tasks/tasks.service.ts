import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  //get all task
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  //get task by id
  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ id });
    if (!found) {
      throw new NotFoundException(`Not found task with id: ${id}`);
    }
    return found;
  }

  //create task
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  // update task
  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.taskRepository.save(task);

    return task;
  }

  //delete task
  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.delete({ id });

    if (task.affected === 0) {
      throw new NotFoundException(`Not found task with id: ${id}`);
    }
  }
}

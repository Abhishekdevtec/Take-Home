import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../modules/auth/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('projects/:projectId/tasks')
  create(@Param('projectId') projectId: string, @Body() body: any) {
    return this.tasksService.createTask(projectId, body);
  }

  @Get('projects/:projectId/tasks')
  getTasks(@Param('projectId') projectId: string) {
    return this.tasksService.getTasks(projectId);
  }

  @Patch('tasks/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.updateTask(id, body);
  }

  @Delete('tasks/:id')
  delete(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
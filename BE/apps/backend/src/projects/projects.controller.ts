
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../modules/auth/jwt/jwt.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() body: any) {
    const userId = req.user.id;
    return this.projectsService.createProject(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.projectsService.getProjectById(id, userId);
  }

@UseGuards(JwtAuthGuard)
@Get()
getAll(@Req() req) {
  const userId = req.user.id;
  return this.projectsService.getProjects(userId);
}

@UseGuards(JwtAuthGuard)
@Patch(':id')
update(
  @Param('id') id: string,
  @Body() body: any,
  @Req() req,
) {
  const userId = req.user.id;

  return this.projectsService.updateProject(id, userId, body);
}

@UseGuards(JwtAuthGuard)
@Delete(':id')
delete(
  @Param('id') id: string,
  @Req() req,
) {
  const userId = req.user.id;

  return this.projectsService.deleteProject(id, userId);
}
}

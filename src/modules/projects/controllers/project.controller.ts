import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto, GetProjectsQueryDto } from '../dto/project.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { APP_CONSTANT } from '../../../common/constant/app_constant';
import { User } from '../../../common/decorators/user.decorator';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async getProjects(@Query() query: GetProjectsQueryDto) {
    const result = await this.projectService.getAllProjects(query);
    
    return {
      success: true,
      data: result.projects,
      message: 'Projects retrieved successfully',
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10,
        total: result.total,
        totalPages: Math.ceil(result.total / (query.limit || 10)),
        hasNext: (query.page || 1) * (query.limit || 10) < result.total,
        hasPrev: (query.page || 1) > 1,
      },
    };
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured projects' })
  @ApiResponse({ status: 200, description: 'Featured projects retrieved successfully' })
  async getFeaturedProjects() {
    const projects = await this.projectService.getFeaturedProjects();
    
    return {
      success: true,
      data: projects,
      message: 'Featured projects retrieved successfully',
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search projects' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchProjects(@Query('q') searchTerm: string) {
    const projects = await this.projectService.searchProjects(searchTerm);
    
    return {
      success: true,
      data: projects,
      message: 'Search results retrieved successfully',
    };
  }

  @Get(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProjectById(@Param('id') id: string) {
    const project = await this.projectService.getProjectById(id);
    
    return {
      success: true,
      data: project,
      message: 'Project retrieved successfully',
    };
  }

  @Post()
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Create new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createProject(@Body() createProjectDto: CreateProjectDto, @User('id') userId: string) {
    const project = await this.projectService.createProject(createProjectDto, userId);
    
    return {
      success: true,
      data: project,
      message: 'Project created successfully',
    };
  }

  @Put(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @User('id') userId: string,
  ) {
    const project = await this.projectService.updateProject(id, updateProjectDto, userId);
    
    return {
      success: true,
      data: project,
      message: 'Project updated successfully',
    };
  }

  @Delete(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  async deleteProject(@Param('id') id: string, @User('id') userId: string) {
    await this.projectService.deleteProject(id, userId);
    
    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }
}

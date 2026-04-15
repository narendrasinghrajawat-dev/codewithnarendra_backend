import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto, GetProjectsQueryDto } from '../dto/project.dto';
import { ApiResponse } from '../../../common/interfaces/common.interfaces';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @Roles('USER', 'ADMIN')
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
  async searchProjects(@Query('q') searchTerm: string) {
    const projects = await this.projectService.searchProjects(searchTerm);
    
    return {
      success: true,
      data: projects,
      message: 'Search results retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  async getProjectById(@Param('id') id: string) {
    const project = await this.projectService.getProjectById(id);
    
    return {
      success: true,
      data: project,
      message: 'Project retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new project' })
  @Roles('USER', 'ADMIN')
  async createProject(@Body() createProjectDto: CreateProjectDto, @Body() userId: string) {
    const project = await this.projectService.createProject(createProjectDto, userId);
    
    return {
      success: true,
      data: project,
      message: 'Project created successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  @Roles('USER', 'ADMIN')
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Body() userId: string,
  ) {
    const project = await this.projectService.updateProject(id, updateProjectDto, userId);
    
    return {
      success: true,
      data: project,
      message: 'Project updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  @Roles('USER', 'ADMIN')
  async deleteProject(@Param('id') id: string, @Body() userId: string) {
    await this.projectService.deleteProject(id, userId);
    
    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { CreateProjectDto, UpdateProjectDto, GetProjectsQueryDto } from '../dto/project.dto';
import { UnauthorizedException, NotFoundException } from '../../../common/exceptions/app.exceptions';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto, userId: string): Promise<ProjectDocument> {
    const project = new this.projectModel({
      ...createProjectDto,
      createdBy: userId,
      sortOrder: 0,
    });

    return project.save();
  }

  async getAllProjects(query: GetProjectsQueryDto = {}): Promise<{ projects: ProjectDocument[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.projectModel
        .find({})
        .sort({ [query.sortBy || 'createdAt']: query.sortOrder || 'desc' })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.projectModel.countDocuments(),
    ]);

    return { projects, total };
  }

  async getProjectById(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id);
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id);
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if user is the owner of the project
    if (project.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You can only update your own projects');
    }

    Object.assign(project, updateProjectDto);
    project.updatedAt = new Date();
    
    return project.save();
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const project = await this.projectModel.findById(id);
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if user is the owner of the project
    if (project.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You can only delete your own projects');
    }

    await this.projectModel.findByIdAndDelete(id);
  }

  async searchProjects(searchTerm: string): Promise<ProjectDocument[]> {
    const regex = new RegExp(searchTerm, 'i');
    
    return this.projectModel
      .find({
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } },
          { technologies: { $regex: regex } },
        ],
      })
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getFeaturedProjects(): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ isFeatured: true })
      .sort({ sortOrder: 1, createdAt: 'desc' })
      .exec();
  }

  async getProjectsByUserId(userId: string): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ createdBy: userId })
      .sort({ createdAt: 'desc' })
      .exec();
  }
}

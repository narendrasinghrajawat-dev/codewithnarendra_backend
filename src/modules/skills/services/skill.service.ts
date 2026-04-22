import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { CreateSkillDto, UpdateSkillDto } from './dto/skill.dto';
import { UnauthorizedException, NotFoundException } from '../../common/exceptions/app.exceptions';
import { ApiResponse } from '../../common/interfaces/common.interfaces';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
  ) {}

  async createSkill(createSkillDto: CreateSkillDto, userId: string): Promise<SkillDocument> {
    const skill = new this.skillModel({
      ...createSkillDto,
      createdBy: userId,
    });

    return skill.save();
  }

  async getAllSkills(): Promise<SkillDocument[]> {
    return this.skillModel
      .find()
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getSkillById(id: string): Promise<SkillDocument> {
    const skill = await this.skillModel.findById(id);
    
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async updateSkill(id: string, updateSkillDto: UpdateSkillDto, userId: string): Promise<SkillDocument> {
    const skill = await this.skillModel.findById(id);
    
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    // Check if user is the owner of the skill
    if (skill.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You can only update your own skills');
    }

    Object.assign(skill, updateSkillDto);
    skill.updatedAt = new Date();
    
    return skill.save();
  }

  async deleteSkill(id: string, userId: string): Promise<void> {
    const skill = await this.skillModel.findById(id);
    
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    // Check if user is the owner of the skill
    if (skill.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You can only delete your own skills');
    }

    await this.skillModel.findByIdAndDelete(id);
  }

  async getSkillsByCategory(category: string): Promise<SkillDocument[]> {
    return this.skillModel
      .find({ category })
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getSkillsByLevel(level: string): Promise<SkillDocument[]> {
    return this.skillModel
      .find({ level })
      .sort({ createdAt: 'desc' })
      .exec();
  }
}

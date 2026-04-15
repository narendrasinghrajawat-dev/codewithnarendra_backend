import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Education, EducationDocument } from '../schemas/education.schema';
import { CreateEducationDto, UpdateEducationDto } from '../dto/education.dto';
import { UnauthorizedException, NotFoundException } from '../../../common/exceptions/app.exceptions';
import { ApiResponse } from '../../../common/interfaces/common.interfaces';

@Injectable()
export class EducationService {
  constructor(
    @InjectModel(Education.name) private educationModel: Model<EducationDocument>,
  ) {}

  async createEducation(createEducationDto: CreateEducationDto, userId: string): Promise<EducationDocument> {
    const education = new this.educationModel({
      ...createEducationDto,
      createdBy: userId,
    });

    return education.save();
  }

  async getAllEducation(): Promise<EducationDocument[]> {
    return this.educationModel
      .find()
      .sort({ startDate: 'desc' })
      .exec();
  }

  async getEducationById(id: string): Promise<EducationDocument> {
    const education = await this.educationModel.findById(id);
    
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return education;
  }

  async updateEducation(id: string, updateEducationDto: UpdateEducationDto, userId: string): Promise<EducationDocument> {
    const education = await this.educationModel.findById(id);
    
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    // Check if user is the owner of the education
    if (education.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You can only update your own education');
    }

    Object.assign(education, updateEducationDto);
    education.updatedAt = new Date();
    
    return education.save();
  }

  async deleteEducation(id: string, userId: string): Promise<void> {
    const education = await this.educationModel.findById(id);
    
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    // Check if user is the owner of the education
    if (education.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You can only delete your own education');
    }

    await this.educationModel.findByIdAndDelete(id);
  }

  async getEducationByUserId(userId: string): Promise<EducationDocument[]> {
    return this.educationModel
      .find({ createdBy: userId })
      .sort({ startDate: 'desc' })
      .exec();
  }
}

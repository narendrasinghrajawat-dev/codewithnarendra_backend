import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from './schemas/about.schema';
import { CreateAboutDto, UpdateAboutDto } from './dto/about.dto';
import { UnauthorizedException, NotFoundException } from '../../common/exceptions/app.exceptions';
import { ApiResponse } from '../../common/interfaces/common.interfaces';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(About.name) private aboutModel: Model<AboutDocument>,
  ) {}

  async createAbout(createAboutDto: CreateAboutDto, userId: string): Promise<AboutDocument> {
    const about = new this.aboutModel({
      ...createAboutDto,
      createdBy: userId,
    });

    return about.save();
  }

  async getAbout(): Promise<AboutDocument | null> {
    const about = await this.aboutModel.findOne();
    return about;
  }

  async getAboutById(id: string): Promise<AboutDocument> {
    const about = await this.aboutModel.findById(id);
    
    if (!about) {
      throw new NotFoundException('About not found');
    }

    return about;
  }

  async updateAbout(id: string, updateAboutDto: UpdateAboutDto, userId: string): Promise<AboutDocument> {
    const about = await this.aboutModel.findById(id);
    
    if (!about) {
      throw new NotFoundException('About not found');
    }

    // Check if user is the owner of the about
    if (about.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You can only update your own about section');
    }

    Object.assign(about, updateAboutDto);
    about.updatedAt = new Date();
    
    return about.save();
  }

  async deleteAbout(id: string, userId: string): Promise<void> {
    const about = await this.aboutModel.findById(id);
    
    if (!about) {
      throw new NotFoundException('About not found');
    }

    // Check if user is the owner of the about
    if (about.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You can only delete your own about section');
    }

    await this.aboutModel.findByIdAndDelete(id);
  }
}

import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ProjectSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [String] })
  technologies: string[];

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({ required: true })
  projectUrl: string;

  @Prop({ required: true })
  repositoryUrl: string;

  @Prop({ required: false })
  isFeatured: boolean;

  @Prop({ required: false })
  sortOrder: number;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type ProjectDocument = ProjectSchema & Document;

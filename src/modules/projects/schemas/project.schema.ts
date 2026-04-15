import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  technologies: string[];

  @Prop({ type: [String], required: true })
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

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);

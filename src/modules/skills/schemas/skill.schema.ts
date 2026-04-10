import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SkillSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['beginner', 'intermediate', 'advanced', 'expert'] })
  level: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: false })
  yearsOfExperience: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type SkillDocument = SkillSchema & Document;

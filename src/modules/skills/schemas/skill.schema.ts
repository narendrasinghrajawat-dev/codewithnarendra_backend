import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Skill {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['beginner', 'intermediate', 'advanced', 'expert'] })
  level: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: false })
  yearsOfExperience: number;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type SkillDocument = Skill & Document;
export const SkillSchema = SchemaFactory.createForClass(Skill);

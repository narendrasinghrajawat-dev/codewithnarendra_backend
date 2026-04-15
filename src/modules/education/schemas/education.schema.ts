import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Education {
  @Prop({ required: true })
  institution: string;

  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  field: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: false })
  endDate: Date;

  @Prop({ required: false })
  description: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })
  createdBy: string;
}

export type EducationDocument = Education & Document;
export const EducationSchema = SchemaFactory.createForClass(Education);

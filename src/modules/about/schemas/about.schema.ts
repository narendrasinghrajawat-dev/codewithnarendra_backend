import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class About {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  resumeUrl: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  location: string;

  @Prop({ required: false })
  website: string;

  @Prop({ required: false })
  linkedin: string;

  @Prop({ required: false })
  github: string;

  @Prop({ required: false })
  twitter: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type AboutDocument = About & Document;
export const AboutSchema = SchemaFactory.createForClass(About);

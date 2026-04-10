import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserSchema {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false })
  avatarUrl: string;

  @Prop({ required: false })
  bio: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  website: string;

  @Prop({ required: false })
  location: string;

  @Prop({ required: true, enum: ['USER', 'ADMIN'] })
  role: string;

  @Prop({ required: false })
  firebaseUid: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type UserDocument = UserSchema & Document;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ required: false })
  avatarUrl?: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: false })
  website?: string;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: true, enum: ['1', '2'], default: '1' })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;
  
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false })
  verificationToken?: string;

  @Prop({ required: false })
  verificationTokenExpires?: Date;

  @Prop({ required: false })
  resetPasswordToken?: string;

  @Prop({ required: false })
  resetPasswordExpires?: Date;

  @Prop({ required: false })
  firebaseUid?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

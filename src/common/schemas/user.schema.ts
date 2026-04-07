import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../entities/user.entity';

@Schema()
export class UserSchema {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false, select: false })
  password: string;

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

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type UserDocument = UserSchema & Document;

import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsEnum(['beginner', 'intermediate', 'advanced', 'expert'])
  level: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;
}

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced', 'expert'])
  level?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

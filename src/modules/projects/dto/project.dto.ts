import { IsString, IsOptional, IsArray, IsEnum, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsUrl()
  projectUrl: string;

  @IsUrl()
  repositoryUrl: string;

  @IsOptional()
  @IsString()
  isFeatured: boolean;

  @IsOptional()
  sortOrder: number;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsUrl()
  projectUrl?: string;

  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;

  @IsOptional()
  isFeatured?: boolean;

  @IsOptional()
  sortOrder?: number;
}

export class GetProjectsQueryDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}

export enum ProjectSortField {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  SORT_ORDER = 'sortOrder',
}

import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateAboutDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  resumeUrl?: string;
}

export class UpdateAboutDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  resumeUrl?: string;
}

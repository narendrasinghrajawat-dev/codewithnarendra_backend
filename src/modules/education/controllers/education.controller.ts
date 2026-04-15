import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body,
  UseGuards,
} from '@nestjs/common';
import { EducationService } from '../services/education.service';
import { CreateEducationDto, UpdateEducationDto } from '../dto/education.dto';
import { ApiResponse } from '../../../common/interfaces/common.interfaces';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  @Roles('USER', 'ADMIN')
  async getAllEducation() {
    const education = await this.educationService.getAllEducation();
    
    return {
      success: true,
      data: education,
      message: 'Education retrieved successfully',
    };
  }

  @Get(':id')
  @Roles('USER', 'ADMIN')
  async getEducationById(@Param('id') id: string) {
    const education = await this.educationService.getEducationById(id);
    
    return {
      success: true,
      data: education,
      message: 'Education retrieved successfully',
    };
  }

  @Post()
  @Roles('USER', 'ADMIN')
  async createEducation(@Body() createEducationDto: CreateEducationDto, @Body() userId: string) {
    const education = await this.educationService.createEducation(createEducationDto, userId);
    
    return {
      success: true,
      data: education,
      message: 'Education created successfully',
    };
  }

  @Put(':id')
  @Roles('USER', 'ADMIN')
  async updateEducation(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
    @Body() userId: string,
  ) {
    const education = await this.educationService.updateEducation(id, updateEducationDto, userId);
    
    return {
      success: true,
      data: education,
      message: 'Education updated successfully',
    };
  }

  @Delete(':id')
  @Roles('USER', 'ADMIN')
  async deleteEducation(@Param('id') id: string, @Body() userId: string) {
    await this.educationService.deleteEducation(id, userId);
    
    return {
      success: true,
      message: 'Education deleted successfully',
    };
  }
}

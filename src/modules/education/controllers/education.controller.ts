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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EducationService } from '../services/education.service';
import { CreateEducationDto, UpdateEducationDto } from '../dto/education.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { APP_CONSTANT } from '../../../common/constant/app_constant';
import { User } from '../../../common/decorators/user.decorator';

@ApiTags('education')
@ApiBearerAuth()
@Controller('education')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Get all education entries' })
  @ApiResponse({ status: 200, description: 'Education entries retrieved successfully' })
  async getAllEducation() {
    const education = await this.educationService.getAllEducation();
    
    return {
      success: true,
      data: education,
      message: 'Education retrieved successfully',
    };
  }

  @Get(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Get education by ID' })
  @ApiResponse({ status: 200, description: 'Education retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Education not found' })
  async getEducationById(@Param('id') id: string) {
    const education = await this.educationService.getEducationById(id);
    
    return {
      success: true,
      data: education,
      message: 'Education retrieved successfully',
    };
  }

  @Post()
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Create new education entry' })
  @ApiResponse({ status: 201, description: 'Education created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createEducation(@Body() createEducationDto: CreateEducationDto, @User('id') userId: string) {
    const education = await this.educationService.createEducation(createEducationDto, userId);
    
    return {
      success: true,
      data: education,
      message: 'Education created successfully',
    };
  }

  @Put(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Update education entry' })
  @ApiResponse({ status: 200, description: 'Education updated successfully' })
  @ApiResponse({ status: 404, description: 'Education not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  async updateEducation(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
    @User('id') userId: string,
  ) {
    const education = await this.educationService.updateEducation(id, updateEducationDto, userId);
    
    return {
      success: true,
      data: education,
      message: 'Education updated successfully',
    };
  }

  @Delete(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Delete education entry' })
  @ApiResponse({ status: 200, description: 'Education deleted successfully' })
  @ApiResponse({ status: 404, description: 'Education not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  async deleteEducation(@Param('id') id: string, @User('id') userId: string) {
    await this.educationService.deleteEducation(id, userId);
    
    return {
      success: true,
      message: 'Education deleted successfully',
    };
  }
}
 
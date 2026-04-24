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
import { AboutService } from '../services/about.service';
import { CreateAboutDto, UpdateAboutDto } from '../dto/about.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { APP_CONSTANT } from '../../../common/constant/app_constant';
import { User } from '../../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('about')
@ApiBearerAuth()
@Controller('about')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Get all about sections' })
  @ApiResponse({ status: 200, description: 'About sections retrieved successfully' })
  async getAbout() {
    const about = await this.aboutService.getAbout();
    
    return {
      success: true,
      data: about,
      message: 'About retrieved successfully',
    };
  }

  @Get(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Get about section by ID' })
  @ApiResponse({ status: 200, description: 'About section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'About section not found' })
  async getAboutById(@Param('id') id: string) {
    const about = await this.aboutService.getAboutById(id);
    
    return {
      success: true,
      data: about,
      message: 'About retrieved successfully',
    };
  }

  @Post()
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Create a new about section' })
  @ApiResponse({ status: 201, description: 'About section created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAbout(@Body() createAboutDto: CreateAboutDto, @User('id') userId: string) {
    const about = await this.aboutService.createAbout(createAboutDto, userId);
    
    return {
      success: true,
      data: about,
      message: 'About created successfully',
    };
  }

  @Put(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Update about section' })
  @ApiResponse({ status: 200, description: 'About section updated successfully' })
  @ApiResponse({ status: 404, description: 'About section not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  async updateAbout(
    @Param('id') id: string,
    @Body() updateAboutDto: UpdateAboutDto,
    @User('id') userId: string,
  ) {
    const about = await this.aboutService.updateAbout(id, updateAboutDto, userId);
    
    return {
      success: true,
      data: about,
      message: 'About updated successfully',
    };
  }

  @Delete(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Delete about section' })
  @ApiResponse({ status: 200, description: 'About section deleted successfully' })
  @ApiResponse({ status: 404, description: 'About section not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  async deleteAbout(@Param('id') id: string, @User('id') userId: string) {
    await this.aboutService.deleteAbout(id, userId);
    
    return {
      success: true,
      message: 'About deleted successfully',
    };
  }
}

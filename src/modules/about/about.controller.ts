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
import { AboutService } from './about.service';
import { CreateAboutDto, UpdateAboutDto } from './dto/about.dto';
import { ApiResponse } from '../../common/interfaces/common.interfaces';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @Roles('USER', 'ADMIN')
  async getAbout() {
    const about = await this.aboutService.getAbout();
    
    return {
      success: true,
      data: about,
      message: 'About retrieved successfully',
    };
  }

  @Get(':id')
  @Roles('USER', 'ADMIN')
  async getAboutById(@Param('id') id: string) {
    const about = await this.aboutService.getAboutById(id);
    
    return {
      success: true,
      data: about,
      message: 'About retrieved successfully',
    };
  }

  @Post()
  @Roles('USER', 'ADMIN')
  async createAbout(@Body() createAboutDto: CreateAboutDto, @Body() userId: string) {
    const about = await this.aboutService.createAbout(createAboutDto, userId);
    
    return {
      success: true,
      data: about,
      message: 'About created successfully',
    };
  }

  @Put(':id')
  @Roles('USER', 'ADMIN')
  async updateAbout(
    @Param('id') id: string,
    @Body() updateAboutDto: UpdateAboutDto,
    @Body() userId: string,
  ) {
    const about = await this.aboutService.updateAbout(id, updateAboutDto, userId);
    
    return {
      success: true,
      data: about,
      message: 'About updated successfully',
    };
  }

  @Delete(':id')
  @Roles('USER', 'ADMIN')
  async deleteAbout(@Param('id') id: string, @Body() userId: string) {
    await this.aboutService.deleteAbout(id, userId);
    
    return {
      success: true,
      message: 'About deleted successfully',
    };
  }
}

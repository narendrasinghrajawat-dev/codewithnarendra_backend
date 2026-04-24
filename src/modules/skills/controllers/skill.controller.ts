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
import { SkillService } from '../services/skill.service';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { APP_CONSTANT } from '../../../common/constant/app_constant';
import { User } from '../../../common/decorators/user.decorator';

@ApiTags('skills')
@ApiBearerAuth()
@Controller('skills')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({ status: 200, description: 'Skills retrieved successfully' })
  async getAllSkills() {
    const skills = await this.skillService.getAllSkills();
    
    return {
      success: true,
      data: skills,
      message: 'Skills retrieved successfully',
    };
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured skills' })
  @ApiResponse({ status: 200, description: 'Featured skills retrieved successfully' })
  async getFeaturedSkills() {
    const skills = await this.skillService.getSkillsByLevel('expert');
    
    return {
      success: true,
      data: skills,
      message: 'Featured skills retrieved successfully',
    };
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get skills by category' })
  @ApiResponse({ status: 200, description: 'Skills retrieved successfully' })
  async getSkillsByCategory(@Param('category') category: string) {
    const skills = await this.skillService.getSkillsByCategory(category);
    
    return {
      success: true,
      data: skills,
      message: 'Skills retrieved successfully',
    };
  }

  @Get('level/:level')
  @ApiOperation({ summary: 'Get skills by level' })
  @ApiResponse({ status: 200, description: 'Skills retrieved successfully' })
  async getSkillsByLevel(@Param('level') level: string) {
    const skills = await this.skillService.getSkillsByLevel(level);
    
    return {
      success: true,
      data: skills,
      message: 'Skills retrieved successfully',
    };
  }

  @Get(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({ status: 200, description: 'Skill retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async getSkillById(@Param('id') id: string) {
    const skill = await this.skillService.getSkillById(id);
    
    return {
      success: true,
      data: skill,
      message: 'Skill retrieved successfully',
    };
  }

  @Post()
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Create new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createSkill(@Body() createSkillDto: CreateSkillDto, @User('id') userId: string) {
    const skill = await this.skillService.createSkill(createSkillDto, userId);
    
    return {
      success: true,
      data: skill,
      message: 'Skill created successfully',
    };
  }

  @Put(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Update skill' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  async updateSkill(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @User('id') userId: string,
  ) {
    const skill = await this.skillService.updateSkill(id, updateSkillDto, userId);
    
    return {
      success: true,
      data: skill,
      message: 'Skill updated successfully',
    };
  }

  @Delete(':id')
  @Roles(APP_CONSTANT.ROLE.USER, APP_CONSTANT.ROLE.ADMIN)
  @ApiOperation({ summary: 'Delete skill' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  async deleteSkill(@Param('id') id: string, @User('id') userId: string) {
    await this.skillService.deleteSkill(id, userId);
    
    return {
      success: true,
      message: 'Skill deleted successfully',
    };
  }
}

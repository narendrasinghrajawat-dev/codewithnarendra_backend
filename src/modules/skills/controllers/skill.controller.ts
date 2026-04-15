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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkillService } from '../services/skill.service';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';
import { ApiResponse } from '../../../common/interfaces/common.interfaces';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @Roles('USER', 'ADMIN')
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
  async getSkillsByLevel(@Param('level') level: string) {
    const skills = await this.skillService.getSkillsByLevel(level);
    
    return {
      success: true,
      data: skills,
      message: 'Skills retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by ID' })
  async getSkillById(@Param('id') id: string) {
    const skill = await this.skillService.getSkillById(id);
    
    return {
      success: true,
      data: skill,
      message: 'Skill retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new skill' })
  @Roles('USER', 'ADMIN')
  async createSkill(@Body() createSkillDto: CreateSkillDto, @Body() userId: string) {
    const skill = await this.skillService.createSkill(createSkillDto, userId);
    
    return {
      success: true,
      data: skill,
      message: 'Skill created successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update skill' })
  @Roles('USER', 'ADMIN')
  async updateSkill(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @Body() userId: string,
  ) {
    const skill = await this.skillService.updateSkill(id, updateSkillDto, userId);
    
    return {
      success: true,
      data: skill,
      message: 'Skill updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete skill' })
  @Roles('USER', 'ADMIN')
  async deleteSkill(@Param('id') id: string, @Body() userId: string) {
    await this.skillService.deleteSkill(id, userId);
    
    return {
      success: true,
      message: 'Skill deleted successfully',
    };
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageStatus } from './schemas/page.schema';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new page' })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  async create(@Request() req, @Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pages' })
  @ApiResponse({ status: 200, description: 'Return all pages' })
  async findAll(@Query('status') status?: PageStatus) {
    if (status) {
      return this.pagesService.findAll({ status });
    }
    return this.pagesService.findPublished();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search pages' })
  @ApiResponse({ status: 200, description: 'Return matching pages' })
  async search(@Query('q') query: string) {
    return this.pagesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get page by id' })
  @ApiResponse({ status: 200, description: 'Return page details' })
  async findOne(@Param('id') id: string) {
    const page = await this.pagesService.findById(id);
    await this.pagesService.incrementViewCount(id);
    return page;
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Get page by slug' })
  @ApiResponse({ status: 200, description: 'Return page details' })
  async findBySlug(@Param('slug') slug: string) {
    const page = await this.pagesService.findBySlug(slug);
    await this.pagesService.incrementViewCount(page.id);
    return page;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update page' })
  @ApiResponse({ status: 200, description: 'Page updated successfully' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.update(id, updatePageDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete page' })
  @ApiResponse({ status: 200, description: 'Page deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.pagesService.delete(id);
  }
} 
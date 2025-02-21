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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogStatus } from './schemas/blog.schema';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new blog post' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully' })
  async create(@Request() req, @Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({ status: 200, description: 'Return all blog posts' })
  async findAll(@Query('status') status?: BlogStatus) {
    if (status) {
      return this.blogService.findAll({ status });
    }
    return this.blogService.findPublished();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search blog posts' })
  @ApiResponse({ status: 200, description: 'Return matching blog posts' })
  async search(@Query('q') query: string) {
    return this.blogService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog post by id' })
  @ApiResponse({ status: 200, description: 'Return blog post details' })
  async findOne(@Param('id') id: string) {
    const blog = await this.blogService.findById(id);
    await this.blogService.incrementViewCount(id);
    return blog;
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiResponse({ status: 200, description: 'Return blog post details' })
  async findBySlug(@Param('slug') slug: string) {
    const blog = await this.blogService.findBySlug(slug);
    await this.blogService.incrementViewCount(blog.id);
    return blog;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Put(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like blog post' })
  @ApiResponse({ status: 200, description: 'Blog post liked successfully' })
  async like(@Request() req, @Param('id') id: string) {
    return this.blogService.toggleLike(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog post' })
  @ApiResponse({ status: 200, description: 'Blog post deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
} 
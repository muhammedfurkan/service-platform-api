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
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProviderResponseDto } from './dto/provider-response.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  async create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    if (req.user.userType !== UserRole.CUSTOMER) {
      throw new BadRequestException('Only customers can create reviews');
    }
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Return all reviews' })
  async findAll(@Query('service') serviceId?: string, @Query('provider') providerId?: string) {
    if (serviceId) {
      return this.reviewsService.findByService(serviceId);
    }
    if (providerId) {
      return this.reviewsService.findByProvider(providerId);
    }
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review details' })
  @ApiResponse({ status: 200, description: 'Return review details' })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  @Put(':id/provider-response')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add provider response to review' })
  @ApiResponse({ status: 200, description: 'Provider response added successfully' })
  async addProviderResponse(
    @Request() req,
    @Param('id') id: string,
    @Body() response: ProviderResponseDto,
  ) {
    if (req.user.userType !== UserRole.PROVIDER) {
      throw new BadRequestException('Only providers can respond to reviews');
    }
    return this.reviewsService.addProviderResponse(id, req.user.id, response);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update review status (Admin)' })
  @ApiResponse({ status: 200, description: 'Review status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateReviewStatusDto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateStatus(id, updateReviewStatusDto);
  }

  @Put(':id/helpful')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark review as helpful' })
  @ApiResponse({ status: 200, description: 'Review marked as helpful' })
  async markHelpful(@Param('id') id: string) {
    return this.reviewsService.markHelpful(id);
  }

  @Put(':id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report review' })
  @ApiResponse({ status: 200, description: 'Review reported successfully' })
  async reportReview(@Param('id') id: string) {
    return this.reviewsService.reportReview(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review (Admin)' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
} 
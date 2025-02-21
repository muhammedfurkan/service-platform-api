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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UserRole } from '../users/schemas/user.schema';
import { ServiceStatus } from './schemas/service.schema';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  async create(@Request() req, @Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'Return all services' })
  async findAll(@Query() query: any) {
    return this.servicesService.findAll(query);
  }

  @Get('provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider services' })
  @ApiResponse({ status: 200, description: 'Return provider services' })
  async findProviderServices(@Request() req) {
    return this.servicesService.findByProvider(req.user.id);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get services by category' })
  @ApiResponse({ status: 200, description: 'Return services by category' })
  async findByCategory(@Param('categoryId') categoryId: string) {
    return this.servicesService.findByCategory(categoryId);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby services' })
  @ApiResponse({ status: 200, description: 'Return nearby services' })
  async findNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number, // km cinsinden
  ) {
    return this.servicesService.findNearby(lng, lat, distance);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by id' })
  @ApiResponse({ status: 200, description: 'Return service details' })
  async findOne(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, req.user.id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.servicesService.delete(id, req.user.id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service status' })
  @ApiResponse({ status: 200, description: 'Service status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ServiceStatus,
  ) {
    return this.servicesService.updateStatus(id, status);
  }

  @Put(':id/featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle service featured status' })
  @ApiResponse({ status: 200, description: 'Service featured status updated' })
  async toggleFeatured(@Param('id') id: string) {
    return this.servicesService.toggleFeatured(id);
  }
} 
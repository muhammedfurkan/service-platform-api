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
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  async create(@Request() req, @Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto, req.user.id);
  }

  @Post('generate')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Generate quick report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  async generate(@Request() req, @Body() generateReportDto: GenerateReportDto) {
    const title = `${generateReportDto.type} Report - ${generateReportDto.period}`;
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    // Tarih aralığını belirle
    switch (generateReportDto.period) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        endDate = new Date(now.setDate(now.getDate() + 6));
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date();
        endDate = new Date();
    }

    const createReportDto: CreateReportDto = {
      title,
      type: generateReportDto.type,
      period: generateReportDto.period,
      startDate,
      endDate,
      fileType: generateReportDto.format || 'pdf',
    };

    return this.reportsService.create(createReportDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, description: 'Return all reports' })
  async findAll(@Request() req) {
    return this.reportsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by id' })
  @ApiResponse({ status: 200, description: 'Return report details' })
  async findOne(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update report' })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete report' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.reportsService.delete(id);
  }
} 
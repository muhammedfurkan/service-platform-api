import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { Upload } from './schemas/upload.schema';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new upload' })
  @ApiResponse({ status: 201, description: 'The upload has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() uploadData: Partial<Upload>) {
    return this.uploadsService.create(uploadData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all uploads' })
  @ApiResponse({ status: 200, description: 'Return all uploads.', type: [Upload] })
  async findAll() {
    return this.uploadsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get upload by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Upload ID' })
  @ApiResponse({ status: 200, description: 'Return the upload.', type: Upload })
  @ApiResponse({ status: 404, description: 'Upload not found.' })
  async findById(@Param('id') id: string) {
    return this.uploadsService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete upload by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Upload ID' })
  @ApiResponse({ status: 200, description: 'Upload successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Upload not found.' })
  async delete(@Param('id') id: string) {
    return this.uploadsService.delete(id);
  }
}
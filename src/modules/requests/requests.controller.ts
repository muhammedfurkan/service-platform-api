import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Request } from './schemas/request.schema';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() requestData: Partial<Request>) {
    return this.requestsService.create(requestData);
  }

  @Get()
  async findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.requestsService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.requestsService.delete(id);
  }
} 
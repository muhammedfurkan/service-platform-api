import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { BidsService } from './bids.service';
import { Bid } from './schemas/bid.schema';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  async create(@Body() bidData: Partial<Bid>) {
    return this.bidsService.create(bidData);
  }

  @Get()
  async findAll() {
    return this.bidsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.bidsService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bidsService.delete(id);
  }
} 
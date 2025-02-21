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
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Create new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    if (req.user.userType !== UserRole.CUSTOMER) {
      throw new BadRequestException('Only customers can create bookings');
    }
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'Return all bookings' })
  async findAll(@Request() req, @Query('type') type?: 'customer' | 'provider') {
    if (type === 'customer') {
      return this.bookingsService.findByCustomer(req.user.id);
    } else if (type === 'provider') {
      return this.bookingsService.findByProvider(req.user.id);
    }
    
    // Only admin can see all bookings
    if (req.user.roles?.includes('admin')) {
      return this.bookingsService.findAll();
    }
    
    throw new BadRequestException('Invalid request');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details' })
  @ApiResponse({ status: 200, description: 'Return booking details' })
  async findOne(@Request() req, @Param('id') id: string) {
    const booking = await this.bookingsService.findById(id);
    
    // Only related customer, provider or admin can see the booking
    if (booking.customerId.toString() !== req.user.id && 
        booking.providerId.toString() !== req.user.id &&
        !req.user.roles?.includes('admin')) {
      throw new BadRequestException('You do not have permission to view this booking');
    }
    
    return booking;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    const booking = await this.bookingsService.findById(id);
    
    // Only customer can update their booking
    if (booking.customerId.toString() !== req.user.id) {
      throw new BadRequestException('You can only update your own bookings');
    }
    
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  async cancel(
    @Request() req,
    @Param('id') id: string,
    @Body() cancelBookingDto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, req.user.id, cancelBookingDto.reason);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete booking (Admin only)' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.bookingsService.delete(id);
  }
} 
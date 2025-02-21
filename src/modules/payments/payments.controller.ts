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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async create(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    if (req.user.userType !== UserRole.CUSTOMER) {
      throw new BadRequestException('Only customers can make payments');
    }
    return this.paymentsService.create(createPaymentDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Return all payments' })
  async findAll(
    @Request() req,
    @Query('type') type?: 'customer' | 'provider'
  ) {
    if (type === 'customer') {
      return this.paymentsService.findByCustomer(req.user.id);
    } else if (type === 'provider') {
      return this.paymentsService.findByProvider(req.user.id);
    }
    
    // Sadece admin tüm ödemeleri görebilir
    if (req.user.roles?.includes('admin')) {
      return this.paymentsService.findAll();
    }
    
    throw new BadRequestException('Invalid request');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({ status: 200, description: 'Return payment details' })
  async findOne(@Request() req, @Param('id') id: string) {
    const payment = await this.paymentsService.findById(id);
    
    // Sadece ilgili müşteri, hizmet sağlayıcı veya admin görebilir
    if (payment.customerId.toString() !== req.user.id && 
        payment.providerId.toString() !== req.user.id &&
        !req.user.roles?.includes('admin')) {
      throw new BadRequestException('You do not have permission to view this payment');
    }
    
    return payment;
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update payment status (Admin)' })
  @ApiResponse({ status: 200, description: 'Payment status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    return this.paymentsService.updateStatus(id, updatePaymentStatusDto);
  }

  @Put(':id/refund')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Process refund (Admin)' })
  @ApiResponse({ status: 200, description: 'Refund processed successfully' })
  async processRefund(
    @Request() req,
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('amount') amount: number,
  ) {
    return this.paymentsService.processRefund(id, reason, amount, req.user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete payment (Admin)' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.paymentsService.delete(id);
  }
} 
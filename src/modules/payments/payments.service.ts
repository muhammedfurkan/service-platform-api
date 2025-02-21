import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument, PaymentStatus } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private bookingsService: BookingsService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, customerId: string): Promise<PaymentDocument> {
    // Rezervasyonu kontrol et
    const booking = await this.bookingsService.findById(createPaymentDto.bookingId);
    
    if (booking.customerId.toString() !== customerId) {
      throw new BadRequestException('You can only make payments for your own bookings');
    }

    const payment = new this.paymentModel({
      ...createPaymentDto,
      customerId,
      providerId: booking.providerId,
      // Komisyon hesaplama (örnek: %10)
      commission: {
        rate: 0.10,
        amount: createPaymentDto.amount * 0.10,
        currency: createPaymentDto.currency || 'TRY'
      }
    });

    return payment.save();
  }

  async findAll(query: any = {}): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find(query)
      .populate('customerId', '-password')
      .populate('providerId', '-password')
      .populate('bookingId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel
      .findById(id)
      .populate('customerId', '-password')
      .populate('providerId', '-password')
      .populate('bookingId')
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async findByCustomer(customerId: string): Promise<PaymentDocument[]> {
    return this.findAll({ customerId });
  }

  async findByProvider(providerId: string): Promise<PaymentDocument[]> {
    return this.findAll({ providerId });
  }

  async updateStatus(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto): Promise<PaymentDocument> {
    const payment = await this.findById(id);

    // Tamamlanmış ödemelerin durumu değiştirilemez
    if (payment.status === PaymentStatus.COMPLETED && updatePaymentStatusDto.status !== PaymentStatus.REFUNDED) {
      throw new BadRequestException('Cannot update status of completed payment');
    }

    // İade durumu için ek kontroller
    if (updatePaymentStatusDto.status === PaymentStatus.REFUNDED) {
      if (!payment.refundDetails) {
        throw new BadRequestException('Refund details are required');
      }
    }

    const updatedPayment = await this.paymentModel
      .findByIdAndUpdate(
        id,
        {
          status: updatePaymentStatusDto.status,
          'paymentDetails.transactionId': updatePaymentStatusDto.transactionId,
          $push: { notes: updatePaymentStatusDto.notes }
        },
        { new: true }
      )
      .exec();

    if (!updatedPayment) {
      throw new NotFoundException('Payment not found');
    }

    return updatedPayment;
  }

  async processRefund(
    id: string, 
    reason: string, 
    amount: number, 
    refundedBy: string
  ): Promise<PaymentDocument> {
    const payment = await this.findById(id);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    if (amount > payment.amount) {
      throw new BadRequestException('Refund amount cannot be greater than payment amount');
    }

    const refundDetails = {
      reason,
      amount,
      refundDate: new Date(),
      refundedBy,
      transactionId: `REF-${Date.now()}`
    };

    const refundedPayment = await this.paymentModel
      .findByIdAndUpdate(
        id,
        {
          status: PaymentStatus.REFUNDED,
          refundDetails,
          $push: { notes: `Refunded: ${reason}` }
        },
        { new: true }
      )
      .exec();

    if (!refundedPayment) {
      throw new NotFoundException('Payment not found');
    }

    return refundedPayment;
  }

  async delete(id: string): Promise<boolean> {
    const payment = await this.findById(id);

    // Sadece bekleyen veya başarısız ödemeler silinebilir
    if (![PaymentStatus.PENDING, PaymentStatus.FAILED].includes(payment.status)) {
      throw new BadRequestException('Only pending or failed payments can be deleted');
    }

    const result = await this.paymentModel.findByIdAndDelete(id).exec();
    return !!result;
  }
} 
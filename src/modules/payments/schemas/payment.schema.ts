import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Booking } from '../../bookings/schemas/booking.schema';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet'
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Booking' })
  bookingId: Booking;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  customerId: User;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  providerId: User;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'TRY' })
  currency: string;

  @Prop({ required: true, enum: PaymentMethod })
  method: PaymentMethod;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ type: Object })
  paymentDetails?: {
    transactionId?: string;
    cardLastFour?: string;
    cardBrand?: string;
    bankName?: string;
    paymentDate?: Date;
  };

  @Prop({ type: Object })
  refundDetails?: {
    reason: string;
    amount: number;
    refundDate: Date;
    refundedBy: string;
    transactionId: string;
  };

  @Prop({ type: Object })
  commission?: {
    rate: number;
    amount: number;
    currency: string;
  };

  @Prop({ type: [String] })
  notes?: string[];

  @Prop({ type: Object })
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    [key: string]: any;
  };
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Müşteri ve duruma göre indeks
PaymentSchema.index({ customerId: 1, status: 1 });

// Sağlayıcı ve duruma göre indeks
PaymentSchema.index({ providerId: 1, status: 1 });

// Rezervasyon ve duruma göre indeks
PaymentSchema.index({ bookingId: 1, status: 1 });

// Tarih ve duruma göre indeks
PaymentSchema.index({ createdAt: 1, status: 1 }); 
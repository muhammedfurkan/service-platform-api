import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Service } from '../../services/schemas/service.schema';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

@Schema({ timestamps: true })
export class Booking {
  _id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  customerId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  providerId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Service' })
  serviceId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 'TRY' })
  currency: string;

  @Prop({
    required: true,
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Prop({
    required: true,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Prop({ type: Object })
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: [number];
  };

  @Prop()
  notes?: string;

  @Prop({ type: Object })
  cancellation?: {
    reason: string;
    cancelledBy: string;
    cancelledAt: Date;
  };
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Tarih ve duruma göre indeks
BookingSchema.index({ date: 1, status: 1 });

// Müşteri ve duruma göre indeks
BookingSchema.index({ customerId: 1, status: 1 });

// Sağlayıcı ve duruma göre indeks
BookingSchema.index({ providerId: 1, status: 1 }); 
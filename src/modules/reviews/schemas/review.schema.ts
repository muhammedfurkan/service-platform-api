import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = Review & Document;

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  customerId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  providerId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Service' })
  serviceId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Booking' })
  bookingId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ type: [String] })
  images?: string[];

  @Prop({ enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @Prop({ type: Object })
  providerResponse?: {
    comment: string;
    respondedAt: Date;
  };

  @Prop({ type: Object })
  metadata?: {
    platform?: string;
    language?: string;
    ipAddress?: string;
    [key: string]: any;
  };

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ type: Object })
  metrics?: {
    helpfulCount: number;
    reportCount: number;
    viewCount: number;
  };
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Hizmet ve duruma göre indeks
ReviewSchema.index({ serviceId: 1, status: 1 });

// Sağlayıcı ve duruma göre indeks
ReviewSchema.index({ providerId: 1, status: 1 });

// Müşteri ve duruma göre indeks
ReviewSchema.index({ customerId: 1, status: 1 });

// Rezervasyon için unique indeks
ReviewSchema.index({ bookingId: 1 }, { unique: true });

// Arama için text indeks
ReviewSchema.index({ comment: 'text', tags: 'text' }); 
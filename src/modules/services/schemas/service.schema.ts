import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Category } from '../../categories/schemas/category.schema';

export type ServiceDocument = Service & Document;

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  REJECTED = 'rejected'
}

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  providerId: User;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categoryId: Category;

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ default: 'TRY' })
  currency: string;

  @Prop({
    type: {
      lng: Number,
      lat: Number,
      properties: {
        address: String,
        city: String,
        state: String
      }
    },
    required: true
  })
  location: {
    lng: number;
    lat: number;
    properties: {
      address: string;
      city: string;
      state: string;
    };
  };

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ enum: ServiceStatus, default: ServiceStatus.PENDING })
  status: ServiceStatus;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: Object })
  metadata: {
    averageRating?: number;
    totalReviews?: number;
    completedBookings?: number;
  };

  @Prop({ type: Object })
  availability: {
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
    exceptions?: {
      date: Date;
      isAvailable: boolean;
    }[];
  };

  @Prop({ type: Object })
  settings: {
    instantBooking: boolean;
    minNotice: number; // Minimum saat cinsinden bildirim süresi
    maxBookingsPerDay: number;
  };
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

// Arama için text index
ServiceSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Location için index
ServiceSchema.index({ 'location.lng': 1, 'location.lat': 1 });

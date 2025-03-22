import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RequestDocument = Request & Document;

export enum RequestStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class Request {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  customerId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  expertId?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subCategory: string;

  @Prop({ required: true })
  budget: number;

  @Prop({ default: 'TRY' })
  currency: string;

  @Prop({ enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Bid' }] })
  bids?: string[];

  @Prop({ type: Object })
  location?: {
    city: string;
    district: string;
    address?: string;
  };

  @Prop({ type: Date })
  preferredDate?: Date;

  @Prop({ type: [String] })
  attachments?: string[];
}

export const RequestSchema = SchemaFactory.createForClass(Request); 
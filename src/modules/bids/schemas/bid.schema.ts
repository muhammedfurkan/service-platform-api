import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BidDocument = Bid & Document;

export enum BidStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class Bid {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Request' })
  requestId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  expertId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'TRY' })
  currency: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: BidStatus, default: BidStatus.PENDING })
  status: BidStatus;

  @Prop()
  estimatedDuration?: number;

  @Prop()
  estimatedStartDate?: Date;

  @Prop({ type: [String] })
  attachments?: string[];
}

export const BidSchema = SchemaFactory.createForClass(Bid); 
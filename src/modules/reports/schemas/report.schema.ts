import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReportDocument = Report & Document;

export enum ReportType {
  BOOKING = 'booking',
  REVENUE = 'revenue',
  USER = 'user',
  SERVICE = 'service',
  PERFORMANCE = 'performance'
}

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true })
  title: string;

  @Prop({ enum: ReportType, required: true })
  type: ReportType;

  @Prop({ enum: ReportPeriod, required: true })
  period: ReportPeriod;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Prop()
  filePath?: string;

  @Prop()
  fileType?: string;

  @Prop({ type: Object })
  filters?: {
    categories?: string[];
    services?: string[];
    providers?: string[];
    customers?: string[];
    statuses?: string[];
    [key: string]: any;
  };

  @Prop({ type: Object })
  data?: {
    summary?: {
      totalCount: number;
      totalAmount?: number;
      averageAmount?: number;
      [key: string]: any;
    };
    details?: any[];
    charts?: {
      type: string;
      data: any;
    }[];
  };

  @Prop()
  error?: string;

  @Prop({ type: Date })
  lastGeneratedAt?: Date;

  @Prop({ type: Object })
  metadata?: {
    generatedBy?: string;
    format?: string;
    size?: number;
    pages?: number;
    [key: string]: any;
  };
}

export const ReportSchema = SchemaFactory.createForClass(Report);

// Tip ve tarih için index
ReportSchema.index({ type: 1, startDate: -1, endDate: -1 });

// Kullanıcı ve durum için index
ReportSchema.index({ userId: 1, status: 1 }); 
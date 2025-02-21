import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

export enum SettingType {
  GENERAL = 'general',
  MAIL = 'mail',
  PAYMENT = 'payment',
  NOTIFICATION = 'notification',
  SOCIAL = 'social',
  INTEGRATION = 'integration'
}

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;

  @Prop({ enum: SettingType, required: true })
  type: SettingType;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ type: Object })
  metadata?: {
    inputType?: string;
    options?: string[];
    validation?: {
      required?: boolean;
      min?: number;
      max?: number;
      pattern?: string;
    };
    group?: string;
    order?: number;
  };
}

export const SettingSchema = SchemaFactory.createForClass(Setting);

// Key için unique index
SettingSchema.index({ key: 1 }, { unique: true });

// Tip için index
SettingSchema.index({ type: 1 }); 
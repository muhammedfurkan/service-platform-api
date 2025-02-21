import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PageDocument = Page & Document;

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum PageType {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
  LANDING = 'landing'
}

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  description?: string;

  @Prop({ enum: PageType, default: PageType.STATIC })
  type: PageType;

  @Prop({ enum: PageStatus, default: PageStatus.DRAFT })
  status: PageStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  authorId: string;

  @Prop()
  template?: string;

  @Prop({ type: Object })
  layout?: {
    header?: boolean;
    footer?: boolean;
    sidebar?: boolean;
  };

  @Prop({ type: Object })
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
  };

  @Prop({ type: Object })
  metadata?: {
    viewCount: number;
    lastModifiedBy: string;
    lastModifiedAt: Date;
  };

  @Prop({ type: [{ type: Object }] })
  sections?: {
    type: string;
    title?: string;
    content?: string;
    image?: string;
    order: number;
    settings?: Record<string, any>;
  }[];
}

export const PageSchema = SchemaFactory.createForClass(Page);

// Slug için unique index
PageSchema.index({ slug: 1 }, { unique: true });

// Durum ve tip için index
PageSchema.index({ status: 1, type: 1 });

// Tam metin araması için index
PageSchema.index(
  { title: 'text', content: 'text', description: 'text' },
  { weights: { title: 10, content: 5, description: 3 } }
); 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BlogDocument = Blog & Document;

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt?: string;

  @Prop({ type: [String] })
  categories: string[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  featuredImage?: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  authorId: string;

  @Prop({ enum: BlogStatus, default: BlogStatus.DRAFT })
  status: BlogStatus;

  @Prop({ type: Date })
  publishedAt?: Date;

  @Prop({ type: Object })
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };

  @Prop({ type: Object })
  metadata?: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
    readTime: number;
  };
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

// Slug için unique index
BlogSchema.index({ slug: 1 }, { unique: true });

// Durum ve tarih için index
BlogSchema.index({ status: 1, publishedAt: -1 });

// Kategori ve etiket araması için index
BlogSchema.index({ categories: 1, tags: 1 });

// Tam metin araması için index
BlogSchema.index(
  { title: 'text', content: 'text', tags: 'text' },
  { weights: { title: 10, content: 5, tags: 3 } }
); 
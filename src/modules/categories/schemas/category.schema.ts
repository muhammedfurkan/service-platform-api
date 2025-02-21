import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop()
  icon?: string;

  @Prop()
  image?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  parentId?: string;

  @Prop({ default: 0 })
  order?: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: Object })
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  toObject() {
    const obj = super.toObject();
    return {
      id: obj._id,
      name: obj.name,
      description: obj.description,
      parentId: obj.parentId
    };
  }
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Slug ve parent kategoriye göre index oluştur
CategorySchema.index({ slug: 1, parentId: 1 }, { unique: true });
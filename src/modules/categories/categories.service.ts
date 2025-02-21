import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    // Aynı slug ve parent altında kategori var mı kontrol et
    const existingCategory = await this.categoryModel.findOne({
      slug: createCategoryDto.slug,
      parentId: createCategoryDto.parentId || null,
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this slug already exists under the same parent');
    }

    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll(query: any = {}): Promise<CategoryDocument[]> {
    return this.categoryModel.find(query)
      .populate('parentId')
      .sort({ order: 1 })
      .exec();
  }

  async findById(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id)
      .populate('parentId')
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDocument> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .populate('parentId')
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async delete(id: string): Promise<boolean> {
    // Alt kategorileri kontrol et
    const hasSubcategories = await this.categoryModel.exists({ parentId: id });
    if (hasSubcategories) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async getTree(): Promise<CategoryDocument[]> {
    // Tüm kategorileri al
    const categories = await this.categoryModel.find().sort({ order: 1 }).exec();
    
    // Kategori ağacını oluştur
    const categoryMap = new Map();
    const roots: CategoryDocument[] = [];

    // Önce tüm kategorileri map'e ekle
    categories.forEach(category => {
      categoryMap.set(category.id.toString(), {
        ...category.toObject(),
        children: []
      });
    });

    // Ağaç yapısını oluştur
    categories.forEach(category => {
      const categoryId = category.id.toString();
      const categoryWithChildren = categoryMap.get(categoryId);

      if (category.parentId) {
        const parent = categoryMap.get(category.parentId.toString());
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        roots.push(categoryWithChildren);
      }
    });

    return roots;
  }

  async toggleFeatured(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.isFeatured = !category.isFeatured;
    return category.save();
  }
} 
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument, PageStatus } from './schemas/page.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<PageDocument>,
  ) {}

  async create(createPageDto: CreatePageDto, authorId: string): Promise<PageDocument> {
    const existingPage = await this.pageModel.findOne({ slug: createPageDto.slug });
    if (existingPage) {
      throw new BadRequestException('Page with this slug already exists');
    }

    const page = new this.pageModel({
      ...createPageDto,
      authorId,
      metadata: {
        viewCount: 0,
        lastModifiedBy: authorId,
        lastModifiedAt: new Date(),
      },
    });

    return page.save();
  }

  async findAll(query: any = {}): Promise<PageDocument[]> {
    return this.pageModel
      .find(query)
      .populate('authorId', '-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPublished(): Promise<PageDocument[]> {
    return this.findAll({ status: PageStatus.PUBLISHED });
  }

  async findById(id: string): Promise<PageDocument> {
    const page = await this.pageModel
      .findById(id)
      .populate('authorId', '-password')
      .exec();

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async findBySlug(slug: string): Promise<PageDocument> {
    const page = await this.pageModel
      .findOne({ slug })
      .populate('authorId', '-password')
      .exec();

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto, userId: string): Promise<PageDocument> {
    const page = await this.pageModel
      .findByIdAndUpdate(
        id,
        {
          ...updatePageDto,
          'metadata.lastModifiedBy': userId,
          'metadata.lastModifiedAt': new Date(),
        },
        { new: true }
      )
      .populate('authorId', '-password')
      .exec();

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pageModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.pageModel.findByIdAndUpdate(id, {
      $inc: { 'metadata.viewCount': 1 }
    });
  }

  async search(query: string): Promise<PageDocument[]> {
    return this.pageModel
      .find(
        { 
          $text: { $search: query },
          status: PageStatus.PUBLISHED 
        },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .populate('authorId', '-password')
      .exec();
  }
} 
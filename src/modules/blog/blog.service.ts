import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument, BlogStatus } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async create(createBlogDto: CreateBlogDto, authorId: string): Promise<BlogDocument> {
    // Slug kontrolü
    const existingBlog = await this.blogModel.findOne({ slug: createBlogDto.slug });
    if (existingBlog) {
      throw new BadRequestException('Blog with this slug already exists');
    }

    const blog = new this.blogModel({
      ...createBlogDto,
      authorId,
      metadata: {
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        readTime: this.calculateReadTime(createBlogDto.content),
      },
    });

    return blog.save();
  }

  async findAll(query: any = {}): Promise<BlogDocument[]> {
    return this.blogModel
      .find(query)
      .populate('authorId', '-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPublished(query: any = {}): Promise<BlogDocument[]> {
    return this.findAll({
      ...query,
      status: BlogStatus.PUBLISHED,
      publishedAt: { $lte: new Date() },
    });
  }

  async findById(id: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findById(id)
      .populate('authorId', '-password')
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async findBySlug(slug: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findOne({ slug })
      .populate('authorId', '-password')
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogDocument> {
    if (updateBlogDto.content) {
      updateBlogDto['metadata.readTime'] = this.calculateReadTime(updateBlogDto.content);
    }

    if (updateBlogDto.status === BlogStatus.PUBLISHED) {
      updateBlogDto['publishedAt'] = new Date();
    }

    const blog = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .populate('authorId', '-password')
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.blogModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.blogModel.findByIdAndUpdate(id, {
      $inc: { 'metadata.viewCount': 1 }
    });
  }

  async toggleLike(id: string, userId: string): Promise<boolean> {
    const blog = await this.findById(id);
    const likes = blog.metadata?.likeCount || 0;
    
    await this.blogModel.findByIdAndUpdate(id, {
      'metadata.likeCount': likes + 1
    });

    return true;
  }

  async search(query: string): Promise<BlogDocument[]> {
    return this.blogModel
      .find(
        { 
          $text: { $search: query },
          status: BlogStatus.PUBLISHED 
        },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .populate('authorId', '-password')
      .exec();
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
} 
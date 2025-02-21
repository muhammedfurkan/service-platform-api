import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument, ReviewStatus } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProviderResponseDto } from './dto/provider-response.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { BookingsService } from '../bookings/bookings.service';
import { ServicesService } from '../services/services.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private bookingsService: BookingsService,
    private servicesService: ServicesService,
  ) {}

  async create(createReviewDto: CreateReviewDto, customerId: string): Promise<ReviewDocument> {
    const booking = await this.bookingsService.findById(createReviewDto.bookingId);

    if (booking.customerId.toString() !== customerId) {
      throw new BadRequestException('You can only review your own bookings');
    }

    if (booking.status !== 'completed') {
      throw new BadRequestException('Sadece tamamlanmış rezervasyonlar değerlendirilebilir');
    }

    const existingReview = await this.reviewModel.findOne({ bookingId: createReviewDto.bookingId });
    if (existingReview) {
      throw new BadRequestException('You have already reviewed this booking');
    }

    const review = new this.reviewModel({
      ...createReviewDto,
      customerId,
      providerId: booking.providerId,
      serviceId: booking.serviceId,
      metrics: {
        helpfulCount: 0,
        reportCount: 0,
        viewCount: 0
      }
    });

    const savedReview = await review.save();

    await this.updateProviderRating(booking.providerId.toString());
    await this.updateServiceRating(booking.serviceId.toString());

    return savedReview;
  }

  async findAll(query: any = {}): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find(query)
      .populate('customerId', '-password')
      .populate('providerId', '-password')
      .populate('serviceId')
      .populate('bookingId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findById(id)
      .populate('customerId', '-password')
      .populate('providerId', '-password')
      .populate('serviceId')
      .populate('bookingId')
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewModel.findByIdAndUpdate(id, {
      $inc: { 'metrics.viewCount': 1 }
    });

    return review;
  }

  async findByService(serviceId: string): Promise<ReviewDocument[]> {
    return this.findAll({ 
      serviceId,
      status: ReviewStatus.APPROVED 
    });
  }

  async findByProvider(providerId: string): Promise<ReviewDocument[]> {
    return this.findAll({ 
      providerId,
      status: ReviewStatus.APPROVED 
    });
  }

  async addProviderResponse(
    id: string, 
    providerId: string, 
    response: ProviderResponseDto
  ): Promise<ReviewDocument> {
    const review = await this.findById(id);

    if (review.providerId.toString() !== providerId) {
      throw new BadRequestException('You can only respond to your own reviews');
    }

    if (review.providerResponse) {
      throw new BadRequestException('You have already responded to this review');
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(
        id,
        {
          providerResponse: {
            comment: response.comment,
            respondedAt: new Date()
          }
        },
        { new: true }
      )
      .exec();

    if (!updatedReview) {
      throw new NotFoundException('Review not found');
    }

    return updatedReview;
  }

  async updateStatus(id: string, updateReviewStatusDto: UpdateReviewStatusDto): Promise<ReviewDocument> {
    const review = await this.findById(id);

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(
        id,
        {
          status: updateReviewStatusDto.status,
          ...(updateReviewStatusDto.reason && { 'metadata.rejectionReason': updateReviewStatusDto.reason })
        },
        { new: true }
      )
      .exec();

    if (!updatedReview) {
      throw new NotFoundException('Review not found');
    }

    return updatedReview;
  }

  async markHelpful(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findByIdAndUpdate(
        id,
        { $inc: { 'metrics.helpfulCount': 1 } },
        { new: true }
      )
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async reportReview(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findByIdAndUpdate(
        id,
        { $inc: { 'metrics.reportCount': 1 } },
        { new: true }
      )
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  private async updateProviderRating(providerId: string): Promise<void> {
    const reviews = await this.findByProvider(providerId);
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    
    // Provider'ın ortalama puanını güncelle
    // Bu kısmı Users servisine taşıyabilirsiniz
  }

  private async updateServiceRating(serviceId: string): Promise<void> {
    const reviews = await this.findByService(serviceId);
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    
    await this.servicesService.update(
      serviceId,
      serviceId, // providerId olarak serviceId'yi geçiyoruz çünkü admin işlemi
      {
        metadata: {
          rating: averageRating,
          reviewCount: reviews.length,
        }
      }
    );
  }
} 
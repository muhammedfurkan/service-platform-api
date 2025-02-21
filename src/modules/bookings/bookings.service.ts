import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private servicesService: ServicesService,
  ) {}

  async create(createBookingDto: CreateBookingDto, customerId: string): Promise<BookingDocument> {
    const service = await this.servicesService.findById(createBookingDto.serviceId);
    
    const booking = new this.bookingModel({
      ...createBookingDto,
      customerId,
      providerId: service.providerId,
      price: service.price,
      currency: service.currency,
    });

    return booking.save();
  }

  async findAll(query: any = {}): Promise<BookingDocument[]> {
    return this.bookingModel
      .find(query)
      .populate('customerId', '-password')
      .populate('providerId', '-password')
      .populate('serviceId')
      .sort({ date: 1, time: 1 })
      .exec();
  }

  async findById(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('customerId', '-password')
      .populate('providerId', '-password')
      .populate('serviceId')
      .exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findByCustomer(customerId: string): Promise<BookingDocument[]> {
    return this.findAll({ customerId });
  }

  async findByProvider(providerId: string): Promise<BookingDocument[]> {
    return this.findAll({ providerId });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async cancel(id: string, userId: string, reason: string): Promise<BookingDocument> {
    const booking = await this.findById(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed booking');
    }

    if (booking.customerId.toString() !== userId && booking.providerId.toString() !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }

    const cancelledBooking = await this.bookingModel
      .findByIdAndUpdate(
        id,
        {
          status: BookingStatus.CANCELLED,
          cancellation: {
            reason,
            cancelledBy: userId,
            cancelledAt: new Date(),
          },
        },
        { new: true },
      )
      .exec();

    if (!cancelledBooking) {
      throw new NotFoundException('Booking not found');
    }

    return cancelledBooking;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
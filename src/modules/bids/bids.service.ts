import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';

@Injectable()
export class BidsService {
  constructor(@InjectModel(Bid.name) private bidModel: Model<BidDocument>) {}

  async create(bidData: Partial<Bid>): Promise<Bid> {
    const bid = new this.bidModel(bidData);
    return bid.save();
  }

  async findAll(): Promise<Bid[]> {
    return this.bidModel.find().exec();
  }

  async findById(id: string): Promise<Bid> {
    const bid = await this.bidModel.findById(id).exec();
    if (!bid) {
      throw new NotFoundException('Bid not found');
    }
    return bid as Bid;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bidModel.findByIdAndDelete(id).exec();
    return !!result;
  }
} 
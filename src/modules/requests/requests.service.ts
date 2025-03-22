import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, RequestDocument } from './schemas/request.schema';

@Injectable()
export class RequestsService {
  constructor(@InjectModel(Request.name) private requestModel: Model<RequestDocument>) {}

  async create(requestData: Partial<Request>): Promise<Request> {
    const request = new this.requestModel(requestData);
    return request.save();
  }

  async findAll(): Promise<Request[]> {
    return this.requestModel.find().exec();
  }

  async findById(id: string): Promise<Request> {
    const request = await this.requestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return request as Request;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.requestModel.findByIdAndDelete(id).exec();
    return !!result;
  }
} 
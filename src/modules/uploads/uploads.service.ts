import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from './schemas/upload.schema';

@Injectable()
export class UploadsService {
  constructor(@InjectModel(Upload.name) private uploadModel: Model<UploadDocument>) {}

  async create(uploadData: Partial<Upload>): Promise<Upload> {
    const upload = new this.uploadModel(uploadData);
    return upload.save();
  }

  async findAll(): Promise<Upload[]> {
    return this.uploadModel.find().exec();
  }

  async findById(id: string): Promise<Upload> {
    const upload = await this.uploadModel.findById(id).exec();
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }
    return upload as Upload;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.uploadModel.findByIdAndDelete(id).exec();
    return !!result;
  }
} 
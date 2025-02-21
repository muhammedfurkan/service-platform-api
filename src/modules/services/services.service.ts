import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument, ServiceStatus } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import axios from 'axios';
import { getDistance, convertDistance } from 'geolib';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(createServiceDto: CreateServiceDto, providerId: string): Promise<ServiceDocument> {
    const service = new this.serviceModel({
      ...createServiceDto,
      providerId,
    });
    
    try {
      const savedService = await service.save();
      return savedService;
    } catch (error) {
      console.error("Kayıt hatası:", error);
      throw error;
    }
  }

  async findAll(query: any = {}): Promise<ServiceDocument[]> {
    return this.serviceModel.find(query)
      .populate('providerId', '-password')
      .populate('categoryId')
      .exec();
  }

  async findById(id: string): Promise<ServiceDocument> {
    const service = await this.serviceModel
      .findById(id)
      .populate('providerId', '-password')
      .populate('categoryId')
      .exec();

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: string, providerId: string, updateServiceDto: UpdateServiceDto): Promise<ServiceDocument> {
    const service = await this.findById(id);

    if (service.providerId.toString() !== providerId) {
      throw new BadRequestException('You can only update your own services');
    }

    const updatedService = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true })
      .populate('providerId', '-password')
      .populate('categoryId')
      .exec();

    if (!updatedService) {
      throw new NotFoundException('Service not found');
    }

    return updatedService;
  }

  async delete(id: string, providerId: string): Promise<boolean> {
    const service = await this.serviceModel.findById(id);
    
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.providerId.toString() !== providerId) {
      throw new BadRequestException('You can only delete your own services');
    }

    const result = await this.serviceModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByProvider(providerId: string): Promise<ServiceDocument[]> {
    return this.serviceModel.find({ providerId })
      .populate('categoryId')
      .exec();
  }

  async findByCategory(categoryId: string): Promise<ServiceDocument[]> {
    return this.serviceModel.find({ 
      categoryId,
      status: ServiceStatus.ACTIVE 
    })
      .populate('providerId', '-password')
      .exec();
  }

  async findNearby(lng: number, lat: number, maxDistance: number = 10): Promise<ServiceDocument[]> {
    console.log("Arama Parametreleri:", { lng, lat, maxDistance });
    
    try {
      let nearbyServices = await this.serviceModel.find()
        .populate('providerId', '-password')
        .populate('categoryId')
        .exec();

      // const distance = geolib.getDistance(address1, address2) kullanılacak
      nearbyServices = nearbyServices.filter(location => {
        const distance = getDistance({ longitude: lng, latitude: lat }, { longitude: location.location.lng, latitude: location.location.lat });
        const distanceKm = convertDistance(distance, 'km');
        // distanceKm'i maxDistance ile karşılaştır eğer distanceKm < maxDistance ise service'i dön
        if (distanceKm <= maxDistance) {
          return location;
        }
      });
      return nearbyServices;
    } catch (error) {
      console.error("Arama hatası:", error);
      throw error;
    }
  }

  async updateStatus(id: string, status: ServiceStatus): Promise<ServiceDocument> {
    const service = await this.serviceModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('providerId', '-password')
      .populate('categoryId')
      .exec();

    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async toggleFeatured(id: string): Promise<ServiceDocument> {
    const service = await this.serviceModel.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    service.isFeatured = !service.isFeatured;
    return service.save();
  }
} 
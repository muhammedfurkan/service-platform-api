import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument, SettingType } from './schemas/setting.schema';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  private cache: Map<string, any> = new Map();

  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {
    this.loadCache();
  }

  private async loadCache(): Promise<void> {
    const settings = await this.settingModel.find().exec();
    settings.forEach(setting => {
      this.cache.set(setting.key, setting.value);
    });
  }

  async create(createSettingDto: CreateSettingDto): Promise<SettingDocument> {
    const existingSetting = await this.settingModel.findOne({ key: createSettingDto.key });
    if (existingSetting) {
      throw new BadRequestException('Setting with this key already exists');
    }

    const setting = new this.settingModel(createSettingDto);
    const savedSetting = await setting.save();
    this.cache.set(savedSetting.key, savedSetting.value);
    return savedSetting;
  }

  async findAll(type?: SettingType): Promise<SettingDocument[]> {
    const query = type ? { type } : {};
    return this.settingModel.find(query).sort('metadata.order').exec();
  }

  async findPublic(): Promise<SettingDocument[]> {
    return this.settingModel.find({ isPublic: true }).exec();
  }

  async findByKey(key: string): Promise<SettingDocument> {
    const setting = await this.settingModel.findOne({ key }).exec();
    if (!setting) {
      throw new NotFoundException('Setting not found');
    }
    return setting;
  }

  async update(key: string, updateSettingDto: UpdateSettingDto): Promise<SettingDocument> {
    const setting = await this.settingModel
      .findOneAndUpdate({ key }, updateSettingDto, { new: true })
      .exec();

    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    this.cache.set(setting.key, setting.value);
    return setting;
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.settingModel.findOneAndDelete({ key }).exec();
    if (result) {
      this.cache.delete(key);
    }
    return !!result;
  }

  async getValue(key: string): Promise<string> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const setting = await this.findByKey(key);
    this.cache.set(key, setting.value);
    return setting.value;
  }

  async getValues(keys: string[]): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    for (const key of keys) {
      result[key] = await this.getValue(key);
    }
    return result;
  }

  async bulkUpdate(settings: Record<string, string>): Promise<void> {
    const operations = Object.entries(settings).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { value } },
      },
    }));

    await this.settingModel.bulkWrite(operations);
    await this.loadCache();
  }
} 
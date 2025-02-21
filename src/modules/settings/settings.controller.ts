import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingType } from './schemas/setting.schema';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new setting' })
  @ApiResponse({ status: 201, description: 'Setting created successfully' })
  async create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, description: 'Return all settings' })
  async findAll(@Query('type') type?: SettingType) {
    return this.settingsService.findAll(type);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public settings' })
  @ApiResponse({ status: 200, description: 'Return public settings' })
  async findPublic() {
    return this.settingsService.findPublic();
  }

  @Get('values')
  @ApiOperation({ summary: 'Get multiple setting values' })
  @ApiResponse({ status: 200, description: 'Return setting values' })
  async getValues(@Query('keys') keys: string) {
    const keyArray = keys.split(',');
    return this.settingsService.getValues(keyArray);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get setting by key' })
  @ApiResponse({ status: 200, description: 'Return setting details' })
  async findOne(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update setting' })
  @ApiResponse({ status: 200, description: 'Setting updated successfully' })
  async update(
    @Param('key') key: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.update(key, updateSettingDto);
  }

  @Put('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  async bulkUpdate(@Body() settings: Record<string, string>) {
    return this.settingsService.bulkUpdate(settings);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete setting' })
  @ApiResponse({ status: 200, description: 'Setting deleted successfully' })
  async remove(@Param('key') key: string) {
    return this.settingsService.delete(key);
  }
} 
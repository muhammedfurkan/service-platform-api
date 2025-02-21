import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServicesModule } from './modules/services/services.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BlogModule } from './modules/blog/blog.module';
import { PagesModule } from './modules/pages/pages.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ReportsModule } from './modules/reports/reports.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    // Temel Modüller
    AuthModule,
    UsersModule,
    
    // Hizmet Modülleri
    ServicesModule,
    CategoriesModule,
    
    // İşlem Modülleri
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    
    // İçerik Modülleri
    BlogModule,
    PagesModule,
    
    // Sistem Modülleri
    SettingsModule,
    NotificationsModule,
    ReportsModule,
  ],
})
export class AppModule {} 
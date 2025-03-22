import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import * as fs from 'fs';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'debug', 'log', 'verbose'], // Tüm log seviyelerini aktif et
    });

    // Global transform interceptor
    app.useGlobalInterceptors(new TransformInterceptor());

    // Global exception filter
    const exceptionFilter = new AllExceptionsFilter();
    app.useGlobalFilters(exceptionFilter);

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    app.enableCors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    });

    const config = new DocumentBuilder()
      .setTitle('HizmetBul API')
      .setDescription('HizmetBul Servis Platformu API Dokümantasyonu')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'Kimlik doğrulama işlemleri')
      .addTag('Services', 'Hizmet yönetimi')
      .addTag('Categories', 'Kategori yönetimi')
      .addTag('Bookings', 'Rezervasyon yönetimi')
      .addTag('Payments', 'Ödeme işlemleri')
      .addTag('Reviews', 'Değerlendirme sistemi')
      .addTag('Users', 'Kullanıcı yönetimi')
      .addTag('Notifications', 'Bildirim sistemi')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    });
    
    // Swagger JSON dosyasını kaydet
    fs.writeFileSync("./swagger-spec.json", JSON.stringify(document, null, 2));

    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Error starting application:', error);
    throw error;
  }
}

bootstrap().catch(err => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
}); 
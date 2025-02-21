# Service Platform API

A NestJS-based REST API for a platform that connects service providers with customers.

[Turkish Version (Türkçe)](#service-platform-api---tr-türkçe)

## Features

- 🔐 JWT-based authentication
- 👥 Customer and service provider roles
- 📑 Category management
- 🛠️ Service management
- 📅 Reservation system
- 💳 Payment system
- ⭐ Ratings and reviews
- 📨 Multiple notification channels (Email, SMS, Push, WebSocket)
- 📍 Location-based service search
- 📱 Real-time notifications with WebSocket support

## Technologies

- NestJS
- MongoDB & Mongoose
- Socket.IO
- JWT Authentication
- Swagger API Documentation
- NodeMailer
- Firebase Admin (Push Notifications)
- Twilio (SMS)

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the project
```sh
git clone https://github.com/your-username/service-platform-api.git
cd service-platform-api
npm install
```

2. Set environment variables
```sh
PORT=3000
MONGODB_URI=mongodb://localhost:27017/service-platform
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
  
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

3. Start the application
```sh
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

4. API Documentation
```sh
http://localhost:3000/api
```

## Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/feature-name`)
3. Make changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to your branch (`git push origin feature/feature-name`)
6. Create a new Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.


--- 

# Service Platform API - TR (Türkçe)

Bu proje, hizmet sağlayıcıları ile müşterileri buluşturan bir platform için geliştirilmiş NestJS tabanlı bir REST API'dir.

## Özellikler

- 🔐 JWT tabanlı kimlik doğrulama
- 👥 Müşteri ve hizmet sağlayıcı rolleri
- 📑 Kategori yönetimi
- 🛠️ Hizmet yönetimi
- 📅 Rezervasyon sistemi
- 💳 Ödeme sistemi
- ⭐ Değerlendirme ve yorumlar
- 📨 Çoklu bildirim kanalları (Email, SMS, Push, WebSocket)
- 📍 Konum bazlı hizmet araması
- 📱 WebSocket desteği ile gerçek zamanlı bildirimler

## Teknolojiler

- NestJS
- MongoDB & Mongoose
- Socket.IO
- JWT Authentication
- Swagger API Documentation
- NodeMailer
- Firebase Admin (Push Notifications)
- Twilio (SMS)

## Başlangıç

### Ön Gereksinimler

- Node.js (v14+)
- MongoDB
- npm veya yarn

### Kurulum

1. Projeyi klonlayın
```sh
git clone https://github.com/your-username/service-platform-api.git
cd service-platform-api
npm install
```

2. Ortam değişkenlerini ayarlayın
```sh
PORT=3000
MONGODB_URI=mongodb://localhost:27017/service-platform
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
````

3. Uygulamayı başlatın
```sh
# Geliştirme
npm run start:dev

# Prodüksiyon
npm run build
npm run start:prod
```

4. API Dokümantasyonu
```sh
http://localhost:3000/api
```

## Katkıda Bulunma

1. Bu depoyu forklayın
2. Yeni bir dal oluşturun (`git checkout -b feature/feature-name`)
3. Değişikliklerinizi yapın
4. Değişikliklerinizi commit edin (`git commit -am 'Add new feature'`)
5. Dalınıza push yapın (`git push origin feature/feature-name`)
6. Bir pull request açın


## Lisans

Distributed under the MIT License. See `LICENSE` for more information.
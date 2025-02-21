export const NotificationExamples = {
  booking: {
    created: {
      customer: {
        title: 'Yeni Rezervasyon',
        message: 'Rezervasyonunuz başarıyla oluşturuldu.',
        data: {
          bookingId: '507f1f77bcf86cd799439011',
          service: 'Ev Temizliği',
          date: '2024-03-01',
          time: '14:30',
          price: 250,
          currency: 'TRY',
        },
      },
      provider: {
        title: 'Yeni Rezervasyon Talebi',
        message: 'Yeni bir rezervasyon talebi aldınız.',
        data: {
          bookingId: '507f1f77bcf86cd799439011',
          customer: {
            name: 'Ahmet Yılmaz',
            phone: '+905551234567',
          },
          service: 'Ev Temizliği',
          date: '2024-03-01',
          time: '14:30',
          location: {
            address: 'Bağdat Caddesi No:123',
            city: 'İstanbul',
            state: 'Kadıköy',
          },
        },
      },
    },
    confirmed: {
      customer: {
        title: 'Rezervasyon Onaylandı',
        message: 'Rezervasyonunuz hizmet sağlayıcı tarafından onaylandı.',
        data: {
          bookingId: '507f1f77bcf86cd799439011',
          provider: {
            name: 'Mehmet Temizlik',
            phone: '+905557654321',
          },
          service: 'Ev Temizliği',
          date: '2024-03-01',
          time: '14:30',
        },
      },
    },
  },
  payment: {
    completed: {
      title: 'Ödeme Başarılı',
      message: 'Ödemeniz başarıyla tamamlandı.',
      data: {
        paymentId: '507f1f77bcf86cd799439012',
        amount: 250,
        currency: 'TRY',
        transactionId: 'TR123456789',
        date: '2024-02-15T10:30:00Z',
      },
    },
    failed: {
      title: 'Ödeme Başarısız',
      message: 'Ödeme işlemi başarısız oldu.',
      data: {
        paymentId: '507f1f77bcf86cd799439013',
        error: 'Yetersiz bakiye',
        amount: 250,
        currency: 'TRY',
      },
    },
  },
  review: {
    created: {
      title: 'Yeni Değerlendirme',
      message: 'Hizmetiniz için yeni bir değerlendirme aldınız.',
      data: {
        reviewId: '507f1f77bcf86cd799439014',
        rating: 4.5,
        comment: 'Çok memnun kaldım, teşekkürler.',
        service: 'Ev Temizliği',
        date: '2024-02-15T10:30:00Z',
      },
    },
  },
}; 
export interface NotificationTemplate {
  email?: {
    subject: string;
    template: string;
  };
  message?: string;
  push?: {
    title: string;
    body: string;
  };
}

interface TemplateCategory {
  [key: string]: NotificationTemplate;
}

export const NotificationTemplates: { [key: string]: TemplateCategory } = {
  booking: {
    created: {
      email: {
        subject: 'Yeni Rezervasyon',
        template: `
          <h2>Yeni Rezervasyon Oluşturuldu</h2>
          <p>Rezervasyon detayları:</p>
          <ul>
            <li>Tarih: {{date}}</li>
            <li>Saat: {{time}}</li>
            <li>Hizmet: {{serviceName}}</li>
          </ul>
        `,
      },
      message: 'Yeni rezervasyonunuz oluşturuldu. Tarih: {{date}}, Saat: {{time}}',
      push: {
        title: 'Yeni Rezervasyon',
        body: '{{serviceName}} için rezervasyonunuz oluşturuldu',
      },
    },
    updated: {
      email: {
        subject: 'Rezervasyon Güncellendi',
        template: `
          <h2>Rezervasyon Durumu Güncellendi</h2>
          <p>Rezervasyonunuz {{status}} durumuna güncellendi.</p>
        `,
      },
      message: 'Rezervasyonunuz {{status}} durumuna güncellendi.',
      push: {
        title: 'Rezervasyon Güncellendi',
        body: 'Rezervasyonunuz {{status}} durumuna güncellendi',
      },
    },
  },
  payment: {
    completed: {
      email: {
        subject: 'Ödeme Başarılı',
        template: `
          <h2>Ödeme Tamamlandı</h2>
          <p>{{amount}} {{currency}} tutarındaki ödemeniz başarıyla tamamlandı.</p>
        `,
      },
      message: '{{amount}} {{currency}} tutarındaki ödemeniz başarıyla tamamlandı.',
      push: {
        title: 'Ödeme Başarılı',
        body: '{{amount}} {{currency}} tutarındaki ödemeniz tamamlandı',
      },
    },
    failed: {
      email: {
        subject: 'Ödeme Başarısız',
        template: `
          <h2>Ödeme Başarısız</h2>
          <p>{{amount}} {{currency}} tutarındaki ödemeniz başarısız oldu.</p>
          <p>Hata: {{error}}</p>
        `,
      },
      message: '{{amount}} {{currency}} tutarındaki ödemeniz başarısız oldu. Hata: {{error}}',
      push: {
        title: 'Ödeme Başarısız',
        body: 'Ödemeniz başarısız oldu. Lütfen tekrar deneyin.',
      },
    },
  },
  review: {
    created: {
      email: {
        subject: 'Yeni Değerlendirme',
        template: `
          <h2>Yeni Değerlendirme Aldınız</h2>
          <p>Puan: {{rating}}/5</p>
          <p>Yorum: {{comment}}</p>
        `,
      },
      message: 'Yeni bir değerlendirme aldınız. Puan: {{rating}}/5',
      push: {
        title: 'Yeni Değerlendirme',
        body: '{{rating}}/5 puan ile yeni bir değerlendirme aldınız',
      },
    },
  },
  system: {
    alert: {
      email: {
        subject: 'Sistem Bildirimi',
        template: `
          <h2>{{title}}</h2>
          <p>{{message}}</p>
        `,
      },
      message: '{{message}}',
      push: {
        title: '{{title}}',
        body: '{{message}}',
      },
    },
  },
}; 
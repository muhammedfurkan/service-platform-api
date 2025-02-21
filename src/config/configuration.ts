export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hizmetbul',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  paymentApi: {
    key: process.env.PAYMENT_API_KEY,
    secret: process.env.PAYMENT_API_SECRET,
    callbackUrl: process.env.PAYMENT_CALLBACK_URL,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});
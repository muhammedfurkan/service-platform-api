module.exports = {
  apps: [
    {
      name: 'uzmanify-api',
      script: 'npm run start:dev',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'DD-MM-YYYY HH:mm',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};

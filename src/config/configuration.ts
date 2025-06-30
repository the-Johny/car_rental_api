export default () => ({
  port: parseInt(process.env.PORT || '', 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret:
      process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '', 10) || 12,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '', 10) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
  },
  app: {
    name: process.env.APP_NAME || 'Your App',
    url: process.env.APP_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
  },
  //   redis:{
  //     host: process.env.REDIS_HOST || 'localhost',
  //     port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  //     password: process.env.REDIS_PASSWORD,
  //   },
});

import dotenv from 'dotenv';
dotenv.config();
const config = {
    port: process.env.PORT || 3000,
    redisHost: process.env.REDIS_HOST || '127.0.0.1',
    redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
    redisPassword: process.env.REDIS_PASSWORD || undefined,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
};
export default config;

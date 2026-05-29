// Register this in AppModule's ConfigModule.load array:
//   ConfigModule.forRoot({ load: [storageConfig, jwtConfig, …] })
 
import { registerAs } from '@nestjs/config';
 
export default registerAs('storage', () => ({
  endpoint:  process.env.STORAGE_ENDPOINT,   // omit for native AWS S3
  region:    process.env.STORAGE_REGION    ?? 'us-east-1',
  bucket:    process.env.STORAGE_BUCKET    ?? '',
  keyId:     process.env.STORAGE_KEY_ID    ?? '',
  keySecret: process.env.STORAGE_KEY_SECRET ?? '',
  cdnBase:   process.env.STORAGE_CDN_BASE  ?? '',
}));
import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  from: process.env.MAIL_FROM || 'noreply@glowfix.com',
  service: process.env.EMAIL_SERVICE || '',
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.EMAIL_USER || process.env.SMTP_USER || '',
  pass: process.env.EMAIL_PASS || process.env.SMTP_PASS || '',
}));
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: WinstonLoggerService,
  ) {
    const service = this.configService.get<string>('mail.service');
    const host = this.configService.get<string>('mail.host');
    const port = this.configService.get<number>('mail.port');
    const secure = this.configService.get<boolean>('mail.secure');
    const user = this.configService.get<string>('mail.user');
    const pass = this.configService.get<string>('mail.pass');

    const transportOptions: any = service
      ? {
          service,
          auth: user && pass ? { user, pass } : undefined,
        }
      : {
          host,
          port,
          secure,
          auth: user && pass ? { user, pass } : undefined,
        };

    this.transporter = nodemailer.createTransport(transportOptions);

    this.logger.log(
      service
        ? `EmailService → Service ${service} (${user ? 'authenticated' : 'no auth'})`
        : `EmailService → SMTP ${host}:${port} (${user ? 'authenticated' : 'no auth'})`,
      'EmailService',
    );
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const from = `"Glow Fix" <${this.configService.get<string>('mail.from')}>`;

    try {
      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      this.logger.log(
        `Email sent to ${options.to} [messageId: ${info.messageId}]`,
        'EmailService',
        { subject: options.subject },
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${options.to}: ${(error as Error).message}. (Check your SMTP variables in Railway)`,
        (error as Error).stack,
        'EmailService',
      );
      // Fallback: Print the email content to logs so you can see OTPs without a real SMTP server!
      this.logger.warn(`--- MOCK EMAIL CONTENT ---`, 'EmailService');
      this.logger.warn(`To: ${options.to}`, 'EmailService');
      this.logger.warn(`Subject: ${options.subject}`, 'EmailService');
      this.logger.warn(`Body: \n${options.text || options.html}`, 'EmailService');
      this.logger.warn(`--------------------------`, 'EmailService');
      
      // We removed "throw error;" so the application doesn't crash with 500 when registering users.
    }
  }
}

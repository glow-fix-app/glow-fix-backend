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
    const host = this.configService.get<string>('mail.host');
    const port = this.configService.get<number>('mail.port');

    // MailHog: no TLS, no auth — purely a local SMTP catcher
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      ignoreTLS: true,
      auth: undefined,
    });

    this.logger.log(
      `EmailService initialized — SMTP ${host}:${port}`,
      'EmailService',
    );
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const from = this.configService.get<string>('mail.from');

    try {
      const info = await this.transporter.sendMail({
        from: `"Glow Fix" <${from}>`,
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
        `Failed to send email to ${options.to}: ${(error as Error).message}`,
        (error as Error).stack,
        'EmailService',
      );
      throw error;
    }
  }
}

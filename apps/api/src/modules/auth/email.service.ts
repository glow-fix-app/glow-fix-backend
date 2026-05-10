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

// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
// import type { Transporter } from 'nodemailer';

// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

// export interface SendEmailOptions {
//   to: string;
//   subject: string;
//   html: string;
//   text?: string; // plain-text fallback
// }

// @Injectable()
// export class EmailService {
//   private transporter: Transporter;

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly logger: WinstonLoggerService,
//   ) {
//     this.transporter = nodemailer.createTransport({
//       host: this.configService.get<string>('mail.host'),
//       port: this.configService.get<number>('mail.port'),
//       secure: this.configService.get<boolean>('mail.secure'), // true for port 465
//       auth: {
//         user: this.configService.get<string>('mail.user'),
//         pass: this.configService.get<string>('mail.pass'),
//       },
//     });
//   }

//   async sendEmail(options: SendEmailOptions): Promise<void> {
//     const nodeEnv = this.configService.get<string>('app.nodeEnv');

//     // Skip actual sending in dev/test — just log
//     if (nodeEnv === 'development' || nodeEnv === 'test') {
//       this.logger.debug(
//         `[DEV] Email to ${options.to} | Subject: ${options.subject}`,
//         'EmailService',
//       );
//       return;
//     }

//     try {
//       await this.transporter.sendMail({
//         from: `"Glow Fix" <${this.configService.get<string>('mail.from')}>`,
//         to: options.to,
//         subject: options.subject,
//         html: options.html,
//         text: options.text,
//       });

//       this.logger.log(`Email sent to ${options.to}`, 'EmailService', {
//         subject: options.subject,
//       });
//     } catch (error) {
//       this.logger.error(
//         `Failed to send email to ${options.to}: ${(error as Error).message}`,
//         (error as Error).stack,
//         'EmailService',
//       );
//       throw error; // let the caller decide whether to swallow or rethrow
//     }
//   }
// }
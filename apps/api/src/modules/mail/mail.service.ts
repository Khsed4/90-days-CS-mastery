import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`MailService initialized with SMTP host: ${host}:${port}`);
    } else {
      this.logger.log('MailService running in DEV mode (OTP will be printed to terminal console)');
    }
  }

  async sendOtpCode(email: string, code: string, recipientName: string = 'Developer'): Promise<boolean> {
    const from = this.configService.get<string>('SMTP_FROM', 'noreply@90dayschallenges.com');

    // Print to console in dev mode
    console.log('\n======================================================');
    console.log(`✉️  EMAIL VERIFICATION CODE FOR: ${email}`);
    console.log(`🔑  VERIFICATION CODE: [ ${code} ]`);
    console.log(`⏱️  VALID FOR: 10 minutes`);
    console.log('======================================================\n');

    if (!this.transporter) {
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: `"90 Days Mastery" <${from}>`,
        to: email,
        subject: `Your Verification Code: ${code} - 90 Days Mastery Challenge`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto;">
            <h2 style="color: #6366f1; margin-top: 0;">Welcome to 90 Days Challenge!</h2>
            <p>Hi <strong>${recipientName}</strong>,</p>
            <p>Use the following 6-digit code to verify your email and save your progress to the cloud:</p>
            <div style="background: rgba(99, 102, 241, 0.15); border: 2px dashed #6366f1; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8;">${code}</span>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}:`, error);
      return false;
    }
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

const DEFAULT_ADMIN_EMAIL = 'anwarramo38@gmail.com';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    const port = Number(this.get('EMAIL_PORT') || 587);

    this.transporter = nodemailer.createTransport({
      host: this.get('EMAIL_HOST') || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: {
        user: this.get('EMAIL_USER'),
        // Gmail app passwords are often pasted with spaces — SMTP rejects those
        pass: (this.get('EMAIL_PASS') || '').replace(/\s+/g, ''),
      },
    });
  }

  async onModuleInit() {
    if (!this.get('EMAIL_USER') || !this.get('EMAIL_PASS')) {
      this.logger.error(
        'EMAIL_USER / EMAIL_PASS are not set — contact form emails will NOT be sent.',
      );
      return;
    }

    try {
      await this.transporter.verify();
      this.logger.log(`SMTP ready — contact emails go to ${this.adminEmail}`);
    } catch (err: unknown) {
      this.logger.error(
        `SMTP connection failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /** Reads a config value and trims stray whitespace from the .env file. */
  private get(key: string): string | undefined {
    return this.config.get<string>(key)?.trim();
  }

  private get adminEmail(): string {
    return this.get('ADMIN_EMAIL') || DEFAULT_ADMIN_EMAIL;
  }

  async sendContactNotification(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<void> {
    const esc = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0F;color:#E2D9F3;padding:32px;border:1px solid rgba(167,139,250,.3);">
        <h2 style="color:#A78BFA;font-size:20px;margin-top:0;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);color:rgba(226,217,243,.5);width:100px;">Name</td><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);">${esc(data.name)}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);color:rgba(226,217,243,.5);">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);"><a href="mailto:${esc(data.email)}" style="color:#A78BFA;">${esc(data.email)}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);color:rgba(226,217,243,.5);">Phone</td><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);">${esc(data.phone || '—')}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(226,217,243,.5);vertical-align:top;">Message</td><td style="padding:10px 0;white-space:pre-wrap;">${esc(data.message)}</td></tr>
        </table>
        <p style="margin-top:24px;font-size:12px;color:rgba(226,217,243,.35);">Sent from Owlex landing page contact form</p>
      </div>
    `;

    const text = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || '—'}`,
      '',
      data.message,
    ].join('\n');

    await this.transporter.sendMail({
      from: `"Owlex Contact" <${this.get('EMAIL_USER')}>`,
      to: this.adminEmail,
      replyTo: data.email,
      subject: `New inquiry from ${data.name} — Owlex`,
      text,
      html,
    });

    this.logger.log(`Contact email sent to ${this.adminEmail} from ${data.email}`);
  }
}

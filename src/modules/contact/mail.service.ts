import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('EMAIL_PORT', 587),
      secure: this.config.get<number>('EMAIL_PORT', 587) === 465,
      auth: {
        user: this.config.get<string>('EMAIL_USER'),
        pass: this.config.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendContactNotification(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<void> {
    const adminEmail = this.config.get<string>(
      'ADMIN_EMAIL',
      'owlexgroup@gmail.com',
    );

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0F;color:#E2D9F3;padding:32px;border:1px solid rgba(167,139,250,.3);">
        <h2 style="color:#A78BFA;font-size:20px;margin-top:0;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);color:rgba(226,217,243,.5);width:100px;">Name</td><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);">${data.name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);color:rgba(226,217,243,.5);">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);"><a href="mailto:${data.email}" style="color:#A78BFA;">${data.email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);color:rgba(226,217,243,.5);">Phone</td><td style="padding:10px 0;border-bottom:1px solid rgba(167,139,250,.15);">${data.phone || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:rgba(226,217,243,.5);vertical-align:top;">Message</td><td style="padding:10px 0;white-space:pre-wrap;">${data.message}</td></tr>
        </table>
        <p style="margin-top:24px;font-size:12px;color:rgba(226,217,243,.35);">Sent from Owlex landing page contact form</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Owlex Contact" <${this.config.get<string>('EMAIL_USER')}>`,
      to: adminEmail,
      replyTo: data.email,
      subject: `New inquiry from ${data.name} — Owlex`,
      html,
    });

    this.logger.log(`Contact email sent from ${data.email}`);
  }
}

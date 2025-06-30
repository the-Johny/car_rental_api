import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { join } from 'path';
export interface EmailTemplateData {
  [key: string]: any;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      // Gmail configuration
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      // Alternative SMTP configuration
      // host: this.configService.get<string>('SMTP_HOST'),
      // port: this.configService.get<number>('SMTP_PORT'),
      // secure: this.configService.get<boolean>('SMTP_SECURE', false),
      // auth: {
      //   user: this.configService.get<string>('SMTP_USER'),
      //   pass: this.configService.get<string>('SMTP_PASSWORD'),
      // },
    });
  }

  async sendVerificationEmail(
    email: string,
    verifyToken: string,
  ): Promise<void> {
    try {
      const verificationUrl = `${this.configService.get<string>('BASE_URL')}/verify-email?token=${verifyToken}`;

      const templateData: EmailTemplateData = {
        verificationUrl,
        email,
        appName: this.configService.get<string>('APP_NAME', 'Your App'),
        supportEmail: this.configService.get<string>(
          'SUPPORT_EMAIL',
          'support@yourapp.com',
        ),
      };

      await this.sendTemplateEmail(
        email,
        'Verify Your Email Address',
        'verification',
        templateData,
      );

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error: unknown) {
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send verification email to ${email}`,
        errorStack,
      );
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    try {
      const resetUrl = `${this.configService.get<string>('BASE_URL')}/reset-password?token=${resetToken}`;

      const templateData: EmailTemplateData = {
        resetUrl,
        email,
        appName: this.configService.get<string>('APP_NAME', 'Your App'),
        supportEmail: this.configService.get<string>(
          'SUPPORT_EMAIL',
          'support@yourapp.com',
        ),
      };

      await this.sendTemplateEmail(
        email,
        'Reset Your Password',
        'password-reset',
        templateData,
      );

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      throw new Error('Failed to send password reset email');
    }
  }

  private async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    templateData: EmailTemplateData,
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      const templatePath = join(
        process.cwd(),
        'src',
        'templates',
        'emails',
        `${templateName}.ejs`,
      );

      const htmlContent = await ejs.renderFile(templatePath, templateData);

      const mailOptions: nodemailer.SendMailOptions = {
        from: `"${this.configService.get<string>('APP_NAME', 'Your App')}" <${this.configService.get<string>('EMAIL_USER')}>`,
        to,
        subject,
        html: htmlContent,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const result = await this.transporter.sendMail(mailOptions);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Email sent successfully: ${result.messageId}`);

      return result;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error('Error sending template email', error.stack);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    try {
      const templateData: EmailTemplateData = {
        userName,
        email,
        appName: this.configService.get<string>('APP_NAME', 'Your App'),
        supportEmail: this.configService.get<string>(
          'SUPPORT_EMAIL',
          'support@yourapp.com',
        ),
        dashboardUrl: `${this.configService.get<string>('BASE_URL')}/dashboard`,
      };

      await this.sendTemplateEmail(
        email,
        `Welcome to ${this.configService.get<string>('APP_NAME', 'Your App')}!`,
        'welcome',
        templateData,
      );

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${email}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      throw new Error('Failed to send welcome email');
    }
  }

  // Health check method to verify email service configuration
  async verifyConnection(): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.transporter.verify();
      this.logger.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error('Email service connection failed', error.stack);
      return false;
    }
  }
}

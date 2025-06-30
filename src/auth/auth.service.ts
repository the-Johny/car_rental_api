import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { RegisterDto } from './dto/register.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.user.dto';
import { ForgotPasswordDto } from './dto/forgotpassword';
import { ResetPasswordDto } from './dto/resetpassword.dto';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Registration logic
  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already in use');
      }
      if (existingUser.phone === dto.phone) {
        throw new ConflictException('Phone number already in use');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Generate verification token
    const verifyToken = randomBytes(32).toString('hex');
    const verifyTokenExpiresAt = new Date();
    verifyTokenExpiresAt.setHours(verifyTokenExpiresAt.getHours() + 24); // 24 hours

    const user = await this.prisma.user.create({
      data: {
        firstname: dto.firstName,
        lastname: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        role: dto.role || 'CUSTOMER',
        phone: dto.phone,
        verifyToken,
        verifyTokenExpiresAt,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    // TODO: Send verification email with verifyToken
    await this.emailService.sendVerificationEmail(user.email, verifyToken); // TODO: Send verification email with verifyToken
    await this.emailService.sendVerificationEmail(user.email, verifyToken);

    return {
      success: true,
      message:
        'User registered successfully. Please check your email to verify your account.',
      user,
    };
  }

  // Login logic
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        firstname: true,
        lastname: true,
        isActive: true,
        isVerified: true,
        isDeleted: true,
      },
    });

    if (!user || user.isDeleted || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      success: true,
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    };
  }

  // Forgot password - generate reset token
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || user.isDeleted || !user.isActive) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    // Generate cryptographically secure reset token
    const resetToken = randomBytes(32).toString('hex');

    // Set token expiration (1 hour from now)
    const resetTokenExp = new Date();
    resetTokenExp.setHours(resetTokenExp.getHours() + 1);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp,
      },
    });

    // TODO: Send password reset email
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
      // Remove resetToken from response for security (only for development)
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    };
  }

  // Reset password with token
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { resetToken: dto.resetToken },
    });

    if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (user.isDeleted || !user.isActive) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  // Change password for authenticated users
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        isActive: true,
        isDeleted: true,
      },
    });

    if (!user || user.isDeleted || !user.isActive) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  // Verify email
  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verifyToken: token },
    });

    if (
      !user ||
      !user.verifyTokenExpiresAt ||
      user.verifyTokenExpiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: undefined,
        verifyTokenExpiresAt: null,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  // Resend verification email
  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.isDeleted || !user.isActive) {
      return {
        success: true,
        message:
          'If the email exists and is not verified, a verification email has been sent.',
      };
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    const verifyToken = randomBytes(32).toString('hex');
    const verifyTokenExpiresAt = new Date();
    verifyTokenExpiresAt.setHours(verifyTokenExpiresAt.getHours() + 24);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verifyToken,
        verifyTokenExpiresAt,
      },
    });

    // TODO: Send verification email
    // await this.emailService.sendVerificationEmail(user.email, verifyToken);

    return {
      success: true,
      message: 'Verification email sent successfully',
      ...(process.env.NODE_ENV === 'development' && { verifyToken }),
    };
  }

  // Validate user for JWT strategy
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        isActive: true,
        isVerified: true,
        isDeleted: true,
      },
    });

    if (!user || !user.isActive || user.isDeleted || !user.isVerified) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  // Get user profile
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      user,
    };
  }
}

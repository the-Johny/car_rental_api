import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.user.dto';
import { ForgotPasswordDto } from './dto/forgotpassword';
import { ResetPasswordDto } from './dto/resetpassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // @Post('change-password')
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.OK)
  // async changePassword(
  //   @Request() req: any,
  //   @Body() changePasswordDto: ChangePasswordDto,
  // ) {
  //   return this.authService.changePassword(req.user.userId, changePasswordDto);
  // }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new Error('Verification token is required');
    }
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerificationEmail(@Body('email') email: string) {
    if (!email) {
      throw new Error('Email is required');
    }
    return this.authService.resendVerificationEmail(email);
  }

  // @Get('profile')
  // @UseGuards(AuthGuard('jwt'))
  // async getProfile(@Request() req: any) {
  //   return this.authService.getProfile(req.user.userId);
  // }

  // @Get('validate')
  // @UseGuards(AuthGuard('jwt'))
  // validateToken(@Request() req: { user: any }) {
  //   return {
  //     success: true,
  //     message: 'Token is valid',
  //     user: req.user,
  //   };
  // }
}

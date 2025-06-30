import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  phone: string;

  @IsEnum(['ADMIN', 'AGENT', 'CUSTOMER'])
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
}

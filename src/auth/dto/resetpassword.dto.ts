import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Reset token should not be empty' })
  @IsString()
  resetToken: string;
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}

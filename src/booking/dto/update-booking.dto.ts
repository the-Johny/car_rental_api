// src/bookings/dto/update-booking.dto.ts
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

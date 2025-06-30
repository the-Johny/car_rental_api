import {
  IsDateString,
  IsUUID,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  // Add other statuses as needed
}

export class CreateBookingDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  vehicleId: string;

  @IsDateString()
  startdate: string; // Note: lowercase 'd' to match Prisma model

  @IsDateString()
  enddate: string; // Note: lowercase 'd' to match Prisma model

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsNumber()
  totalPrice: number;
}

// DTO for updating bookings - all fields optional
export class UpdateBookingDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @IsDateString()
  @IsOptional()
  startdate?: string;

  @IsDateString()
  @IsOptional()
  enddate?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}

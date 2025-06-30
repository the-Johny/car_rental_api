// src/payments/dto/make-payment.dto.ts
import { IsUUID, IsNumber, IsString } from 'class-validator';

export class MakePaymentDto {
  @IsUUID()
  bookingId: string;

  @IsNumber()
  amount: number;

  @IsString()
  paymentMethod: string; // e.g., 'card', 'paypal', 'flutterwave'
}

// src/payments/entities/payment.entity.ts
export class Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: 'PAID' | 'FAILED' | 'PENDING';
  paymentMethod: string;
  createdAt: Date;
}

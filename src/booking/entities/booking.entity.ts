// src/bookings/entities/booking.entity.ts
export class Booking {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'REJECTED';
  totalPrice: number;
  createdAt: Date;
}

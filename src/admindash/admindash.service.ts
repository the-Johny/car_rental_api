import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [users, vehicles, bookings, payments] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.vehicle.count(),
      this.prisma.booking.count(),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
    ]);
    return {
      totalUsers: users,
      totalVehicles: vehicles,
      totalBookings: bookings,
      totalRevenue: payments._sum.amount || 0,
    };
  }
}

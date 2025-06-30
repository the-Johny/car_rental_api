import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  // create(data: CreateBookingDto) {
  //   // Map status if necessary to match Prisma's expected enum values
  //   const mappedData = {
  //     ...data,
  //     status:
  //       data.status === BookingStatus.CANCELED || data.status === 'CANCELED'
  //         ? 'CANCELED'
  //         : data.status,
  //   };
  //   return this.prisma.booking.create({ data: mappedData });
  // }

  findAll() {
    return this.prisma.booking.findMany({
      include: { user: true, vehicle: true },
    });
  }

  findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, vehicle: true },
    });
  }

  // update(id: string, data: UpdateBookingDto) {
  //   return this.prisma.booking.update({ where: { id }, data });
  // }

  remove(id: string) {
    return this.prisma.booking.delete({ where: { id } });
  }
}

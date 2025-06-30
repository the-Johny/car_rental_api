import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  // create(data: MakePaymentDto) {
  //   return this.prisma.payment.create({ data });
  // }

  findAll() {
    return this.prisma.payment.findMany({ include: { booking: true } });
  }

  findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });
  }

  // update(id: string, data: UpdatePaymentDto) {
  //   return this.prisma.payment.update({ where: { id }, data });
  // }

  remove(id: string) {
    return this.prisma.payment.delete({ where: { id } });
  }
}

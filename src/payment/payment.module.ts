import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [],
  providers: [PaymentService, PrismaService],
})
export class PaymentModule {}

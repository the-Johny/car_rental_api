// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { AdmindashModule } from './admindash/admindash.module';
import { UserModule } from './users/users.module';
import { BookingsModule } from './booking/booking.module';
import { VehiclesModule } from './vehiclemanag/vehiclemanag.module';
import { ServiceModule } from './service/service.module';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    BookingsModule,
    PaymentModule,
    VehiclesModule,
    AdmindashModule,
    ConfigModule,
    ServiceModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}

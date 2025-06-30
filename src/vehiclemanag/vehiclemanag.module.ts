import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleController } from './vehiclemanag.controller';
import { VehicleService } from './vehiclemanag.service';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, PrismaService],
})
export class VehiclesModule {}

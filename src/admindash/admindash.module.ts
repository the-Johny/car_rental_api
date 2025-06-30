import { Module } from '@nestjs/common';
import { DashboardService } from './admindash.service';
import { DashboardController } from './admindash.controller';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class AdmindashModule {}

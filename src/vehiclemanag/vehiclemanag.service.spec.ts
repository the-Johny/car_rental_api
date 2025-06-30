import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehiclemanag.service';

describe('VehiclemanagService', () => {
  let service: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleService],
    }).compile();
    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

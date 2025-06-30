import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehiclemanag.controller';

describe('VehiclemanagController', () => {
  let controller: VehicleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

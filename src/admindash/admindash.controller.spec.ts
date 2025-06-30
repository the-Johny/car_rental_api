import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './admindash.controller';
describe('AdmindashController', () => {
  let controller: DashboardController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

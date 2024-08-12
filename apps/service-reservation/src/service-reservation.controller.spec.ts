import { Test, TestingModule } from '@nestjs/testing';
import { ServiceReservationController } from './service-reservation.controller';
import { ServiceReservationService } from './service-reservation.service';

describe('ServiceReservationController', () => {
  let serviceReservationController: ServiceReservationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceReservationController],
      providers: [ServiceReservationService],
    }).compile();

    serviceReservationController = app.get<ServiceReservationController>(ServiceReservationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceReservationController.getHello()).toBe('Hello World!');
    });
  });
});

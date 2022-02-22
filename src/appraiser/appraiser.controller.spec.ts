import { Test, TestingModule } from '@nestjs/testing';
import { AppraiserController } from './appraiser.controller';
import { AppraiserService } from './appraiser.service';

describe('AppraiserController', () => {
  let controller: AppraiserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppraiserController],
      providers: [AppraiserService],
    }).compile();

    controller = module.get<AppraiserController>(AppraiserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

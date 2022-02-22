import { Test, TestingModule } from '@nestjs/testing';
import { AppraiserService } from './appraiser.service';

describe('AppraiserService', () => {
  let service: AppraiserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppraiserService],
    }).compile();

    service = module.get<AppraiserService>(AppraiserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

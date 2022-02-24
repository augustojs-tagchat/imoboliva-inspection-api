import { Controller } from '@nestjs/common';
import { AppraiserService } from './appraiser.service';

@Controller('appraiser')
export class AppraiserController {
  constructor(private readonly appraiserService: AppraiserService) {}
}

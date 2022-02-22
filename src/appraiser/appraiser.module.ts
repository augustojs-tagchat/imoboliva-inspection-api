import { Module } from '@nestjs/common';
import { AppraiserService } from './appraiser.service';
import { AppraiserController } from './appraiser.controller';

@Module({
  controllers: [AppraiserController],
  providers: [AppraiserService],
})
export class AppraiserModule {}

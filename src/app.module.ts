import { Module } from '@nestjs/common';
import { AppraiserModule } from './appraiser/appraiser.module';

@Module({
  imports: [AppraiserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

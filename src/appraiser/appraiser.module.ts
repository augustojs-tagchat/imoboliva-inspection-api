import { Module } from '@nestjs/common';
import { AppraiserService } from './appraiser.service';
import { AppraiserController } from './appraiser.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appraiser, AppraiserSchema } from './schemas/appraiser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: AppraiserSchema, name: Appraiser.name },
    ]),
  ],
  controllers: [AppraiserController],
  providers: [AppraiserService],
  exports: [AppraiserService],
})
export class AppraiserModule {}

import { Module } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { InspectionController } from './inspection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inspection, InspectionSchema } from './schemas/inspection.entity';
import { AppraiserModule } from 'src/appraiser/appraiser.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: InspectionSchema, name: Inspection.name },
    ]),
    AppraiserModule,
  ],
  controllers: [InspectionController],
  providers: [InspectionService],
})
export class InspectionModule {}

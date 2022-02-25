import { Module } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { InspectionController } from './inspection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inspection, InspectionSchema } from './schemas/inspection.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: InspectionSchema, name: Inspection.name },
    ]),
  ],
  controllers: [InspectionController],
  providers: [InspectionService],
})
export class InspectionModule {}

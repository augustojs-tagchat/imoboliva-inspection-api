import { Module } from '@nestjs/common';
import { InspectionPointsService } from './inspection-points.service';
import { InspectionPointsController } from './inspection-points.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InspectionPointSchema,
  InspectionPoint,
} from './schemas/inspection-point.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: InspectionPointSchema, name: InspectionPoint.name },
    ]),
  ],
  controllers: [InspectionPointsController],
  providers: [InspectionPointsService],
})
export class InspectionPointsModule {}

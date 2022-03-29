import { Module } from '@nestjs/common';
import { InspectionPointsService } from './inspection-points.service';
import { InspectionPointsController } from './inspection-points.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InspectionPointSchema,
  InspectionPoint,
} from './schemas/inspection-point.schema';
import { InspectionModule } from 'src/inspection/inspection.module';
import { FilesModule } from 'src/files/files.module';
import {
  Inspection,
  InspectionSchema,
} from 'src/inspection/schemas/inspection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: InspectionPointSchema, name: InspectionPoint.name },
      { schema: InspectionSchema, name: Inspection.name },
    ]),
    InspectionModule,
    FilesModule,
  ],
  controllers: [InspectionPointsController],
  providers: [InspectionPointsService],
})
export class InspectionPointsModule {}

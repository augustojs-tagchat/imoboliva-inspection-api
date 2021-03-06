import { Module } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { InspectionController } from './inspection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inspection, InspectionSchema } from './schemas/inspection.schema';
import { UserModule } from 'src/users/user.module';
import {
  EntryInspectionSchema,
  EntryInspection,
} from './schemas/entry-inspection.schema';
import { FilesModule } from 'src/files/files.module';
import { AreasModule } from 'src/areas/areas.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: InspectionSchema, name: Inspection.name },
      { schema: EntryInspectionSchema, name: EntryInspection.name },
    ]),
    FilesModule,
    UserModule,
    AreasModule,
  ],
  controllers: [InspectionController],
  providers: [InspectionService],
  exports: [InspectionService],
})
export class InspectionModule {}

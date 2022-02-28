import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaSchema, Area } from './schemas/area.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: AreaSchema, name: Area.name }]),
  ],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}

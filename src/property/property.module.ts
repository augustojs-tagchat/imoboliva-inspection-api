import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './schema/property.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: PropertySchema, name: Property.name },
    ]),
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}

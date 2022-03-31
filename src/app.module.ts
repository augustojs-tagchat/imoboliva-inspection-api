import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InspectionModule } from './inspection/inspection.module';
import { AreasModule } from './areas/areas.module';
import { InspectionPointsModule } from './inspection-points/inspection-points.module';
import { FilesModule } from './files/files.module';
import { PropertyModule } from './property/property.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    AuthenticationModule,
    InspectionModule,
    AreasModule,
    InspectionPointsModule,
    FilesModule,
    PropertyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

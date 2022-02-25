import { Module } from '@nestjs/common';
import { AppraiserModule } from './appraiser/appraiser.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InspectionModule } from './inspection/inspection.module';
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
    AppraiserModule,
    AuthenticationModule,
    InspectionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

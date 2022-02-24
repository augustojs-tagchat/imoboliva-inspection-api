import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { AppraiserModule } from 'src/appraiser/appraiser.module';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  imports: [AppraiserModule],
})
export class AuthenticationModule {}

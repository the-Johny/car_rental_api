import { Module } from '@nestjs/common';
import { ConfigModule as NestJsConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    NestJsConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  exports: [NestJsConfigModule],
})
export class AppConfigModule {}

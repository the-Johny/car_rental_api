import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './users.service';
@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class UserModule {}

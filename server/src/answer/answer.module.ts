import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AnswerController],
  providers: [AnswerService, PrismaService],
})
export class AnswerModule {}

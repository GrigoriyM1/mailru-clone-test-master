import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { FilesModule } from './files/files.module';
import { GatewayModule } from './gateway/gateway.module';
import { NotificationModule } from './notification/notification.module';
import { ReportModule } from './report/report.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';
import { TestModule } from './test/test.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // MailerModule.forRoot({
    //   transport: {
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT),
    //     secure: true,
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.SMTP_PASSWORD,
    //     },
    //   },
    //   defaults: {
    //     from: `"No Reply" <${process.env.SMTP_USER}>`,
    //   },
    // }),
    ConfigModule.forRoot({
      isGlobal: true
    }), 
    AuthModule, 
    UserModule, 
    QuestionModule, 
    AnswerModule, 
    FilesModule, 
    GatewayModule, 
    NotificationModule, 
    ReportModule, 
    StripeModule, WebhookModule, TestModule, 
  ],
  controllers: [AppController],
  // providers: [],
})
export class AppModule {}

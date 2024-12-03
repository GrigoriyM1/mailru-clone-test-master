import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  ],
  controllers: [AppController],
  // providers: [],
})
export class AppModule {}

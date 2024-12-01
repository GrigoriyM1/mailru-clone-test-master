import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

@Module({
  providers: [GatewayController, GatewayService], 
  exports: [GatewayController]
})
export class GatewayModule {}
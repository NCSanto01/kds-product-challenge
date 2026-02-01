import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { RidersModule } from './riders/riders.module';

@Module({
  imports: [OrdersModule, RidersModule],
})
export class AppModule { }

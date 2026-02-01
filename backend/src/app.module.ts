import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { RidersModule } from './riders/riders.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [OrdersModule, RidersModule, UsersModule],
})
export class AppModule { }

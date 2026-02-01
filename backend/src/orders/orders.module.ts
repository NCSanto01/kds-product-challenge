import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { RidersModule } from '../riders/riders.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [forwardRef(() => RidersModule), UsersModule],
    providers: [OrdersService, OrdersGateway],
    exports: [OrdersService],
})
export class OrdersModule { }

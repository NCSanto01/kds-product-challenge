import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { RidersModule } from '../riders/riders.module';

@Module({
    imports: [forwardRef(() => RidersModule)],
    providers: [OrdersService, OrdersGateway],
    exports: [OrdersService],
})
export class OrdersModule { }

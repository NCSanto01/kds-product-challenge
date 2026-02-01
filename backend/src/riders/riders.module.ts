import { Module, forwardRef } from '@nestjs/common';
import { RidersService } from './riders.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [forwardRef(() => OrdersModule)],
    providers: [RidersService],
    exports: [RidersService],
})
export class RidersModule { }

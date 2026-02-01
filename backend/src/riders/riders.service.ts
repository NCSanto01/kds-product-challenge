import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { Rider } from '../dtos/Rider.dto';
import { Subject } from 'rxjs';

@Injectable()
export class RidersService implements OnModuleInit {
    private riders: Rider[] = [];
    private assignedOrderIds: Set<string> = new Set();
    public riderEvents$ = new Subject<{ type: 'added' | 'removed'; rider: Rider }>();

    constructor(
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
    ) { }

    onModuleInit() {
        this.ordersService.orderEvents$.subscribe((order) => {
            this.planRiderAssignment(order.id);
        });
    }

    getRiders(): Rider[] {
        return this.riders;
    }

    private planRiderAssignment(orderId: string) {
        if (this.assignedOrderIds.has(orderId)) return;
        this.assignedOrderIds.add(orderId);

        const delay = Math.floor(Math.random() * 6000) + 4000; // 4-10s
        setTimeout(() => {
            const order = this.ordersService.getOrders().find((o) => o.id === orderId);
            if (order && order.state !== 'CANCELED' && order.state !== 'DELIVERED') {
                const newRider: Rider = { orderWanted: orderId };
                this.riders.push(newRider);
                this.riderEvents$.next({ type: 'added', rider: newRider });
            }
        }, delay);
    }

    removeRider(orderId: string) {
        this.riders = this.riders.filter((r) => r.orderWanted !== orderId);
        this.riderEvents$.next({ type: 'removed', rider: { orderWanted: orderId } });
    }

    // Cleanup riders if orders are canceled
    handleOrderUpdate(orderId: string, state: string) {
        if (state === 'CANCELED') {
            const rider = this.riders.find((r) => r.orderWanted === orderId);
            if (rider) {
                this.removeRider(orderId);
            }
        }
    }
}

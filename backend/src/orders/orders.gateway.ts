import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OrdersService } from './orders.service';
import { RidersService } from '../riders/riders.service';
import { Order } from '../dtos/Order.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class OrdersGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly ordersService: OrdersService,
        private readonly ridersService: RidersService,
    ) { }

    afterInit() {
        this.ordersService.orderEvents$.subscribe((order: Order) => {
            this.server.emit('newOrder', order);
        });

        this.ridersService.riderEvents$.subscribe((event) => {
            if (event.type === 'added') {
                this.server.emit('riderAdded', event.rider);
            } else {
                this.server.emit('riderRemoved', event.rider);
            }
        });
    }

    @SubscribeMessage('updateOrderState')
    handleUpdateOrderState(client: any, payload: { id: string; state: Order['state'] }) {
        try {
            const updatedOrder = this.ordersService.updateOrderState(payload.id, payload.state);
            this.server.emit('orderUpdated', updatedOrder);
            return updatedOrder;
        } catch (e) {
            return { error: e.message };
        }
    }

    @SubscribeMessage('getInitialOrders')
    handleGetInitialOrders() {
        return this.ordersService.getOrders();
    }

    @SubscribeMessage('getInitialRiders')
    handleGetInitialRiders() {
        return this.ridersService.getRiders();
    }

    @SubscribeMessage('removeRider')
    handleRemoveRider(client: any, payload: { orderId: string }) {
        this.ridersService.removeRider(payload.orderId);
    }
}


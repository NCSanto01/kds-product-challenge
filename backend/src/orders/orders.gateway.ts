import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OrdersService } from './orders.service';
import { RidersService } from '../riders/riders.service';
import { UsersService } from '../users/users.service';
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
        private readonly usersService: UsersService,
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
    handleUpdateOrderState(client: any, payload: { id: string; state: Order['state']; userName?: string }) {
        try {
            const updatedOrder = this.ordersService.updateOrderState(payload.id, payload.state, payload.userName);
            this.server.emit('orderUpdated', updatedOrder);
            this.server.emit('workloadUpdated', this.ordersService.getWorkload());
            return updatedOrder;
        } catch (e) {
            return { error: e.message };
        }
    }

    @SubscribeMessage('assignToBestWorker')
    handleAssignToBestWorker(client: any, payload: { orderId: string }) {
        try {
            const updatedOrder = this.ordersService.assignToBestWorker(payload.orderId);
            this.server.emit('orderUpdated', updatedOrder);
            this.server.emit('workloadUpdated', this.ordersService.getWorkload());
            return updatedOrder;
        } catch (e) {
            return { error: e.message };
        }
    }

    @SubscribeMessage('assignOrder')
    handleAssignOrder(client: any, payload: { orderId: string; userName: string }) {
        try {
            const updatedOrder = this.ordersService.assignOrder(payload.orderId, payload.userName);
            this.server.emit('orderUpdated', updatedOrder);
            this.server.emit('workloadUpdated', this.ordersService.getWorkload());
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

    @SubscribeMessage('getUsers')
    handleGetUsers() {
        return this.usersService.getUsers();
    }

    @SubscribeMessage('getWorkload')
    handleGetWorkload() {
        return this.ordersService.getWorkload();
    }

    @SubscribeMessage('removeRider')
    handleRemoveRider(client: any, payload: { orderId: string }) {
        this.ridersService.removeRider(payload.orderId);
    }
}

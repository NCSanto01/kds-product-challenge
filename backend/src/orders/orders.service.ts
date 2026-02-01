import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { Order } from '../dtos/Order.dto';
import { Item } from '../dtos/Item.dto';
import { Subject } from 'rxjs';
import { RidersService } from '../riders/riders.service';

@Injectable()
export class OrdersService implements OnModuleInit {
    private orders: Order[] = [];
    public orderEvents$ = new Subject<Order>();

    constructor(
        @Inject(forwardRef(() => RidersService))
        private readonly ridersService: RidersService,
    ) { }

    onModuleInit() {
        this.startGeneratingOrders();
    }

    getOrders(): Order[] {
        return this.orders;
    }

    updateOrderState(orderId: string, newState: Order['state'], userName?: string): Order {
        const order = this.orders.find((o) => o.id === orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Prevent moving out of DELIVERED or CANCELED
        if (order.state === 'DELIVERED' || order.state === 'CANCELED') {
            return order;
        }

        order.state = newState;

        // Auto-assignment logic
        if (newState === 'IN_PROGRESS' && userName) {
            order.assignedTo = userName;
        } else if (newState === 'PENDING') {
            order.assignedTo = undefined;
        }

        this.ridersService.handleOrderUpdate(orderId, newState);
        return order;
    }

    assignOrder(orderId: string, userName: string): Order {
        const order = this.orders.find((o) => o.id === orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        order.assignedTo = userName;
        return order;
    }

    private startGeneratingOrders() {
        setInterval(() => {
            const pendingOrders = this.orders.filter(o => o.state === 'PENDING');
            if (pendingOrders.length >= 10) return; // Limit to 10 pending orders

            const newOrder: Order = {
                id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                state: 'PENDING',
                items: this.generateRandomItems(),
            };

            this.orders.push(newOrder);
            this.orderEvents$.next(newOrder);
        }, 5000);
    }

    private generateRandomItems(): Item[] {
        const products = [
            { name: 'Burger', price: 12.5 },
            { name: 'Fries', price: 4.5 },
            { name: 'Soda', price: 2.5 },
            { name: 'Pizza', price: 15.0 },
        ];

        const itemCount = Math.floor(Math.random() * 3) + 1;
        return Array.from({ length: itemCount }).map(() => {
            const product = products[Math.floor(Math.random() * products.length)];
            return {
                id: Math.random().toString(36).substr(2, 9),
                name: product.name,
                image: '',
                price: { currency: 'EUR', amount: product.price },
            };
        });
    }
}

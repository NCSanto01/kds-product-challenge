import { Order } from "@/dtos/Order.dto"
import { EventEmitter } from "events"
import { getRandomId, getRandomInterval } from "@/helpers/utilities"

export class OrderOrchestrator {
	private interval: NodeJS.Timeout | undefined
	private maxOrders: number = getRandomInterval(10, 30)
	private eventEmitter = new EventEmitter()

	private emit(order: Order) {
		this.eventEmitter.emit("order", order)
	}

	public run() {
		this.interval = setInterval(() => {
			this.emit({
				id: getRandomId(),
				state: "PENDING",
				items: [
					{
						id: getRandomId(),
						name: "Burger",
						image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100",
						price: { currency: "EUR", amount: 12.5 },
					},
					{
						id: getRandomId(),
						name: "Fries",
						image: "https://images.unsplash.com/photo-1573082883907-809827900505?w=100",
						price: { currency: "EUR", amount: 4.5 },
					},
				],
			})
			this.maxOrders--
			if (this.maxOrders <= 0) {
				clearInterval(this.interval)
			}
		}, 4000)
		return this.eventEmitter
	}
}

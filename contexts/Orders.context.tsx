import { Order } from "@/dtos/Order.dto"
import { OrderOrchestrator } from "@/orchestrators/OrderOrchestrator"
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"

export type OrdersContextProps = {
	orders: Array<Order>
	pickup: (order: Order) => void
	updateOrderState: (orderId: string, newState: Order["state"]) => void
}

export const OrdersContext = createContext<OrdersContextProps>(
	// @ts-ignore
	{},
)

export type OrdersProviderProps = {
	children: ReactNode
}

export function OrdersProvider(props: OrdersProviderProps) {
	const [orders, setOrders] = useState<Array<Order>>([])

	useEffect(() => {
		const orderOrchestrator = new OrderOrchestrator()
		const listener = orderOrchestrator.run()
		listener.on("order", (order) => {
			setOrders((prev) => [...prev, order])
		})
	}, [])

	const updateOrderState = (orderId: string, newState: Order["state"]) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId ? { ...order, state: newState } : order,
			),
		)
	}

	const pickup = (orderToPickup: Order) => {
		const order = orders.find((o) => o.id === orderToPickup.id)
		if (order?.state === "READY") {
			updateOrderState(order.id, "DELIVERED")
			console.log(`Order ${order.id} picked up!`)
		} else {
			alert("¡El pedido aún no está listo!")
		}
	}

	const context = {
		orders,
		pickup,
		updateOrderState,
	}

	return (
		<OrdersContext.Provider value={context}>
			{props.children}
		</OrdersContext.Provider>
	)
}

export const useOrders = () => useContext(OrdersContext)

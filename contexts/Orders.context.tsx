import { Order } from "@/dtos/Order.dto"
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import { io, Socket } from "socket.io-client"

export type OrdersContextProps = {
	orders: Array<Order>
	pickup: (order: Order) => void
	updateOrderState: (orderId: string, newState: Order["state"]) => void
	socket: Socket | null
}

export const OrdersContext = createContext<OrdersContextProps>(
	// @ts-ignore
	{},
)

const SOCKET_URL = "http://localhost:3001"

export function OrdersProvider(props: OrdersProviderProps) {
	const [orders, setOrders] = useState<Array<Order>>([])
	const [socket, setSocket] = useState<Socket | null>(null)

	useEffect(() => {
		const newSocket = io(SOCKET_URL)
		setSocket(newSocket)

		newSocket.emit("getInitialOrders", (initialOrders: Order[]) => {
			setOrders(initialOrders)
		})

		newSocket.on("newOrder", (order: Order) => {
			setOrders((prev) => [...prev, order])
		})

		newSocket.on("orderUpdated", (updatedOrder: Order) => {
			setOrders((prev) =>
				prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
			)
		})

		return () => {
			newSocket.close()
		}
	}, [])

	const updateOrderState = (orderId: string, newState: Order["state"]) => {
		socket?.emit("updateOrderState", { id: orderId, state: newState })
	}

	const pickup = (orderToPickup: Order) => {
		if (orderToPickup.state === "READY") {
			updateOrderState(orderToPickup.id, "DELIVERED")
		} else {
			alert("¡El pedido aún no está listo!")
		}
	}

	const context = {
		orders,
		pickup,
		updateOrderState,
		socket,
	}

	return (
		<OrdersContext.Provider value={context}>
			{props.children}
		</OrdersContext.Provider>
	)
}

export type OrdersProviderProps = {
	children: ReactNode
}

export const useOrders = () => useContext(OrdersContext)

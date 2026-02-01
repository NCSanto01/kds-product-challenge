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
	updateOrderState: (orderId: string, newState: Order["state"], userName?: string) => void
	assignOrder: (orderId: string, userName: string) => void
	assignToBestWorker: (orderId: string) => void
	draggingOrderId: string | null
	setDraggingOrderId: (id: string | null) => void
	workload: { max: number; workers: Record<string, number> }
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
	const [draggingOrderId, setDraggingOrderId] = useState<string | null>(null)
	const [workload, setWorkload] = useState<{ max: number; workers: Record<string, number> }>({
		max: 5,
		workers: {},
	})

	useEffect(() => {
		const newSocket = io(SOCKET_URL)
		setSocket(newSocket)

		newSocket.emit("getInitialOrders", (initialOrders: Order[]) => {
			setOrders(initialOrders)
		})

		newSocket.emit("getWorkload", (initialWorkload: any) => {
			setWorkload(initialWorkload)
		})

		newSocket.on("newOrder", (order: Order) => {
			setOrders((prev) => [...prev, order])
		})

		newSocket.on("orderUpdated", (updatedOrder: Order) => {
			setOrders((prev) =>
				prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
			)
		})

		newSocket.on("workloadUpdated", (newWorkload: any) => {
			setWorkload(newWorkload)
		})

		return () => {
			newSocket.close()
		}
	}, [])

	const updateOrderState = (orderId: string, newState: Order["state"], userName?: string) => {
		socket?.emit("updateOrderState", { id: orderId, state: newState, userName })
	}

	const assignOrder = (orderId: string, userName: string) => {
		socket?.emit("assignOrder", { orderId, userName })
	}

	const assignToBestWorker = (orderId: string) => {
		socket?.emit("assignToBestWorker", { orderId })
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
		assignOrder,
		assignToBestWorker,
		draggingOrderId,
		setDraggingOrderId,
		workload,
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

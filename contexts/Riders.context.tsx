import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import { useOrders } from "@/contexts/Orders.context"
import { getRandomInterval } from "@/helpers/utilities"
import { Rider } from "@/dtos/Rider.dto"

export type RiderData = {
	orderWanted: string
}

export type RidersContextProps = {
	riders: Array<Rider>
}

export const RidersContext = createContext<RidersContextProps>(
	// @ts-ignore
	{},
)

export type RidersProviderProps = {
	children: ReactNode
}

export function RidersProvider(props: RidersProviderProps) {
	const [ridersData, setRidersData] = useState<Array<RiderData>>([])
	const [assignedOrders, setAssignedOrders] = useState<string[]>([])
	const { orders, pickup } = useOrders()

	useEffect(() => {
		const order = orders.find((order) => !assignedOrders.includes(order.id))
		if (order && order.state !== "DELIVERED") {
			setAssignedOrders((prev) => [...prev, order.id])
			setTimeout(
				() => {
					setRidersData((prev) => [
						...prev,
						{
							orderWanted: order.id,
						},
					])
				},
				getRandomInterval(4_000, 10_000),
			)
		}
	}, [orders, assignedOrders])

	const handlePickup = (orderId: string) => {
		const currentOrder = orders.find((o) => o.id === orderId)
		if (currentOrder?.state === "READY") {
			pickup(currentOrder)
			setRidersData((prev) => prev.filter((r) => r.orderWanted !== orderId))
		} else {
			alert(`¡El pedido #${orderId} todavía no está listo para el repartidor!`)
		}
	}

	const context = {
		riders: ridersData.map((r) => ({
			...r,
			pickup: () => handlePickup(r.orderWanted),
		})),
	}

	return (
		<RidersContext.Provider value={context}>
			{props.children}
		</RidersContext.Provider>
	)
}

export const useRiders = () => useContext(RidersContext)

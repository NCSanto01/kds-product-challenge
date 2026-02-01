import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import { useOrders } from "@/contexts/Orders.context"
import { useUser } from "@/contexts/User.context"
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
	const { orders, pickup, socket } = useOrders()
	const { currentUser } = useUser()

	useEffect(() => {
		if (!socket) return

		socket.emit("getInitialRiders", (initialRiders: RiderData[]) => {
			setRidersData(initialRiders)
		})

		socket.on("riderAdded", (rider: RiderData) => {
			setRidersData((prev) => [...prev, rider])
		})

		socket.on("riderRemoved", (rider: RiderData) => {
			setRidersData((prev) => prev.filter((r) => r.orderWanted !== rider.orderWanted))
		})

		return () => {
			socket.off("riderAdded")
			socket.off("riderRemoved")
		}
	}, [socket])

	const handlePickup = (orderId: string) => {
		const currentOrder = orders.find((o) => o.id === orderId)
		if (currentOrder?.state === "READY") {
			pickup(currentOrder)
			socket?.emit("removeRider", { orderId: orderId })
		} else {
			alert(`¡El pedido #${orderId} todavía no está listo para el repartidor!`)
		}
	}

	const context = {
		riders: ridersData
			.filter((r) => {
				if (currentUser?.role === "ADMIN") return true

				const order = orders.find((o) => o.id === r.orderWanted)
				if (!order) return false

				// Worker sees ALL pending riders
				if (order.state === "PENDING") return true

				// Worker only sees riders for orders assigned to them
				return order.assignedTo === currentUser?.name
			})
			.map((r) => {
				const order = orders.find((o) => o.id === r.orderWanted)
				return {
					...r,
					isReady: order?.state === "READY",
					pickup: () => handlePickup(r.orderWanted),
				}
			}),
	}

	return (
		<RidersContext.Provider value={context}>
			{props.children}
		</RidersContext.Provider>
	)
}


export const useRiders = () => useContext(RidersContext)

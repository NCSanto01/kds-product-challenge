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
	const { orders, pickup, socket } = useOrders()

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

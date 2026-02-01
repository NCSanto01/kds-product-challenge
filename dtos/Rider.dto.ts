import { Order } from "@/dtos/Order.dto"

export type Rider = {
	orderWanted: string
	isReady?: boolean
	pickup: (order?: Order) => void
}

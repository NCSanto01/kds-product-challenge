import { Item } from "./Item.dto"

export type Order = {
    id: string
    state: "PENDING" | "IN_PROGRESS" | "READY" | "DELIVERED" | "CANCELED"
    items: Array<Item>
}

import s from "./Kanban.module.scss"
import Column from "@/components/Column/Column"
import { useOrders } from "@/contexts/Orders.context"

export default function Kanban() {
	const { orders, updateOrderState } = useOrders()

	return (
		<section className={s["pk-kanban"]}>
			<Column
				title="📥 Pendiente"
				state="PENDING"
				orders={orders.filter((i) => i.state === "PENDING")}
				onClick={(order) => updateOrderState(order.id, "IN_PROGRESS")}
				onDropOrder={updateOrderState}
			/>
			<Column
				title="🍳 En preparación"
				state="IN_PROGRESS"
				orders={orders.filter((i) => i.state === "IN_PROGRESS")}
				onClick={(order) => updateOrderState(order.id, "READY")}
				onDropOrder={updateOrderState}
			/>
			<Column
				title="✅ Listo para recoger"
				state="READY"
				orders={orders.filter((i) => i.state === "READY")}
				onDropOrder={updateOrderState}
			/>
		</section>
	)
}

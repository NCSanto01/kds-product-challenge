import { useState } from "react"
import s from "./Kanban.module.scss"
import Column from "@/components/Column/Column"
import { useOrders } from "@/contexts/Orders.context"
import classNames from "classnames"

export default function Kanban() {
	const { orders, updateOrderState } = useOrders()
	const [showHistory, setShowHistory] = useState(false)

	return (
		<div className={s["pk-kanban-container"]}>
			<header className={s["pk-kanban-header"]}>
				<button
					className={classNames(s["pk-kanban__toggle-history"], {
						[s["pk-kanban__toggle-history--active"]]: showHistory,
					})}
					onClick={() => setShowHistory(!showHistory)}
				>
					{showHistory ? "🙈 Ocultar Historial" : "📦 Ver Historial"}
				</button>
			</header>

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
				{showHistory && (
					<Column
						title="📦 Entregados"
						state="DELIVERED"
						orders={orders.filter((i) => i.state === "DELIVERED")}
					/>
				)}
			</section>
		</div>
	)
}

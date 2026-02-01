import { useState } from "react"
import s from "./Kanban.module.scss"
import Column from "@/components/Column/Column"
import WorkloadMonitor from "@/components/WorkloadMonitor/WorkloadMonitor"
import { useOrders } from "@/contexts/Orders.context"
import { useUser } from "@/contexts/User.context"
import { Order } from "@/dtos/Order.dto"
import classNames from "classnames"

export default function Kanban() {
	const { orders, updateOrderState, assignToBestWorker } = useOrders()
	const { currentUser } = useUser()
	const [showHistory, setShowHistory] = useState(false)
	const [showCanceled, setShowCanceled] = useState(false)

	const handleUpdateState = (orderId: string, newState: Order["state"]) => {
		const order = orders.find((o) => o.id === orderId)
		if (!order) return

		// Admin Rules:
		if (currentUser?.role === "ADMIN") {
			// Admin cannot move orders directly to IN_PROGRESS (must use worker zones)
			if (newState === "IN_PROGRESS") return
			// Admin can move orders from PENDING to READY/CANCELED directly
		}

		// Worker Rules:
		if (currentUser?.role === "WORKER") {
			// Can drag PENDING -> IN_PROGRESS to self-assign
			const isSelfAssigning = order.state === "PENDING" && newState === "IN_PROGRESS"

			// For READY or CANCELED, order MUST be assigned to the current worker
			if (!isSelfAssigning && (newState === "READY" || newState === "CANCELED")) {
				if (order.assignedTo !== currentUser.name) {
					return
				}
			}
		}

		updateOrderState(orderId, newState, currentUser?.name)
	}

	const handlePendingClick = (order: Order) => {
		if (currentUser?.role === "ADMIN") {
			assignToBestWorker(order.id)
			return
		}
		handleUpdateState(order.id, "IN_PROGRESS")
	}

	const filterOrders = (state: Order["state"]) => {
		const filteredByState = orders.filter((i) => i.state === state)

		if (currentUser?.role === "ADMIN") {
			return filteredByState
		}

		if (state === "PENDING") {
			return filteredByState
		}

		return filteredByState.filter((i) => i.assignedTo === currentUser?.name)
	}

	return (
		<div className={s["pk-kanban-container"]}>
			<header className={s["pk-kanban-header"]}>
				<div className={s["pk-kanban-header__toggles"]}>
					<button
						className={classNames(s["pk-kanban__toggle-history"], {
							[s["pk-kanban__toggle-history--active"]]: showHistory,
						})}
						onClick={() => setShowHistory(!showHistory)}
					>
						{showHistory ? "🙈 Ocultar Historial" : "📦 Ver Historial"}
					</button>
					<button
						className={classNames(s["pk-kanban__toggle-history"], {
							[s["pk-kanban__toggle-history--active"]]: showCanceled,
						})}
						onClick={() => setShowCanceled(!showCanceled)}
					>
						{showCanceled ? "🙈 Ocultar Cancelados" : "🚫 Ver Cancelados"}
					</button>
				</div>
			</header>

			{currentUser?.role === "ADMIN" && <WorkloadMonitor />}

			<section className={s["pk-kanban"]}>
				<Column
					title="📥 Pendiente"
					state="PENDING"
					orders={filterOrders("PENDING")}
					onClick={handlePendingClick}
					onDropOrder={handleUpdateState}
				/>
				<Column
					title="🍳 En preparación"
					state="IN_PROGRESS"
					orders={filterOrders("IN_PROGRESS")}
					onClick={(order) => handleUpdateState(order.id, "READY")}
					onDropOrder={handleUpdateState}
				/>
				<Column
					title="✅ Listo para recoger"
					state="READY"
					orders={filterOrders("READY")}
					onDropOrder={handleUpdateState}
				/>
				{showCanceled && (
					<Column
						title="🚫 Cancelados"
						state="CANCELED"
						orders={filterOrders("CANCELED")}
						onDropOrder={handleUpdateState}
					/>
				)}
				{showHistory && (
					<Column
						title="📦 Entregados"
						state="DELIVERED"
						orders={filterOrders("DELIVERED")}
					/>
				)}
			</section>
		</div>
	)
}

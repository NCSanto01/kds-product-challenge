import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import classNames from "classnames"
import s from "./Column.module.scss"
import { Order } from "@/dtos/Order.dto"
import { useUser } from "@/contexts/User.context"
import { useOrders } from "@/contexts/Orders.context"

export type ColumnProps = {
	orders: Array<Order>
	title: string
	state: Order["state"]
	onClick?: (order: Order) => void
	onDropOrder?: (orderId: string, newState: Order["state"]) => void
}

export default function Column(props: ColumnProps) {
	const [isOver, setIsOver] = useState(false)
	const [activeWorker, setActiveWorker] = useState<string | null>(null)
	const { currentUser, allUsers } = useUser()
	const { assignOrder, updateOrderState, draggingOrderId, setDraggingOrderId } = useOrders()

	const handleDragStart = (e: React.DragEvent, orderId: string) => {
		e.dataTransfer.setData("orderId", orderId)
		e.dataTransfer.effectAllowed = "move"
		// Delaying the state update to let the browser initialize the drag ghost first
		setTimeout(() => setDraggingOrderId(orderId), 0)
	}

	const handleDragEnd = () => {
		setDraggingOrderId(null)
		setActiveWorker(null)
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsOver(true)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsOver(false)

		const orderId = draggingOrderId || e.dataTransfer.getData("orderId")

		if (!orderId) return

		// If it's Admin and IN_PROGRESS, we don't want the default column drop
		if (currentUser?.role === "ADMIN" && props.state === "IN_PROGRESS") return

		if (props.onDropOrder) {
			props.onDropOrder(orderId, props.state)
		}
	}

	const handleWorkerDrop = (workerName: string) => {
		if (draggingOrderId) {
			updateOrderState(draggingOrderId, "IN_PROGRESS", workerName)
			setDraggingOrderId(null)
		}
	}

	const [now, setNow] = useState(Date.now())

	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 5000)
		return () => clearInterval(interval)
	}, [])

	const workers = allUsers.filter(u => u.role === "WORKER")

	return (
		<div
			className={classNames(s["pk-column"], {
				[s["pk-column--over"]]: isOver,
				[s["pk-column--admin-drag"]]: currentUser?.role === "ADMIN" && !!draggingOrderId && props.state === "IN_PROGRESS",
			})}
			onDragOver={handleDragOver}
			onDragLeave={() => setIsOver(false)}
			onDrop={handleDrop}
		>
			{currentUser?.role === "ADMIN" && props.state === "IN_PROGRESS" && draggingOrderId && (
				<div className={s["pk-column__admin-overlays"]}>
					{workers.map(worker => (
						<div
							key={worker.id}
							className={classNames(s["pk-column__worker-zone"], {
								[s["pk-column__worker-zone--active"]]: activeWorker === worker.name
							})}
							onDragEnter={() => setActiveWorker(worker.name)}
							onDragLeave={() => setActiveWorker(null)}
							onDragOver={(e) => {
								e.preventDefault()
								e.stopPropagation()
							}}
							onDrop={(e) => {
								e.preventDefault()
								e.stopPropagation()
								handleWorkerDrop(worker.name)
								setActiveWorker(null)
							}}
						>
							<div className={s["pk-column__worker-circle"]}>
								{worker.name.charAt(0)}
							</div>
							<span>{worker.name}</span>
						</div>
					))}
				</div>
			)}

			<div className={s["pk-column__header"]}>
				<div className={s["pk-column__title"]}>
					<h3>{props.title}</h3>
				</div>
				<span className={s["pk-column__count"]}>{props.orders.length}</span>
			</div>
			<div className={s["pk-column__list"]}>
				<AnimatePresence>
					{props.orders.map((order) => {
						const elapsedMs = now - (order.createdAt || now)
						const minutes = Math.floor(elapsedMs / 60000)

						const isActiveColumn = props.state === "PENDING" || props.state === "IN_PROGRESS" || props.state === "READY"

						const warningLevel = !isActiveColumn
							? "none"
							: minutes >= 3 ? "urgent" : minutes >= 1 ? "warning" : "none"

						const timeStr = new Date(order.createdAt).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
							hour12: false
						})

						return (
							<motion.div
								key={order.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								whileHover={props.state !== "DELIVERED" ? { scale: 1.01 } : {}}
								draggable={props.state !== "DELIVERED"}
								onDragStart={(e) =>
									props.state !== "DELIVERED" &&
									handleDragStart(e as unknown as React.DragEvent, order.id)
								}
								onDragEnd={handleDragEnd}
								className={classNames(s["pk-card"], {
									[s["pk-card--delivered"]]: props.state === "DELIVERED",
									[s["pk-card--assigned"]]: !!order.assignedTo,
									[s[`pk-card--${warningLevel}`]]: warningLevel !== "none",
								})}
							>
								<div onClick={() => props.state !== "DELIVERED" && props.onClick && props.onClick(order)}>
									<div className={s["pk-card__header"]}>
										<div className={s["pk-card__id-group"]}>
											<span>#{order.id}</span>
											<span className={s["pk-card__time"]}>{timeStr}</span>
											{warningLevel === "urgent" && <span className={s["pk-card__alert-icon"]}>🚨</span>}
											{warningLevel === "warning" && <span className={s["pk-card__alert-icon"]}>⚠️</span>}
										</div>
										<span className={s["pk-card__badge"]}>{order.items.length} ítems</span>
									</div>
									<div className={s["pk-card__items"]}>
										{order.items.map((item) => (
											<div key={item.id} className={s["pk-card__item"]}>• {item.name}</div>
										))}
									</div>
								</div>

								<div className={s["pk-card__assignment"]}>
									{order.assignedTo && (
										<div className={s["pk-card__assignee"]}>
											👨‍🍳 {order.assignedTo}
										</div>
									)}
								</div>
							</motion.div>
						)
					})}
				</AnimatePresence>
			</div>
		</div>
	)
}


import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import classNames from "classnames"
import s from "./Column.module.scss"
import { Order } from "@/dtos/Order.dto"

export type ColumnProps = {
	orders: Array<Order>
	title: string
	state: Order["state"]
	onClick?: (order: Order) => void
	onDropOrder?: (orderId: string, newState: Order["state"]) => void
}

export default function Column(props: ColumnProps) {
	const [isOver, setIsOver] = useState(false)

	const handleDragStart = (e: React.DragEvent, orderId: string) => {
		e.dataTransfer.setData("orderId", orderId)
		e.dataTransfer.effectAllowed = "move"
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsOver(true)
	}

	const handleDragLeave = () => {
		setIsOver(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsOver(false)
		const orderId = e.dataTransfer.getData("orderId")
		if (props.onDropOrder) {
			props.onDropOrder(orderId, props.state)
		}
	}

	return (
		<div
			className={classNames(s["pk-column"], {
				[s["pk-column--over"]]: isOver,
			})}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<div className={s["pk-column__title"]}>
				<h3>{props.title}</h3>
			</div>
			<div className={s["pk-column__list"]}>
				<AnimatePresence>
					{props.orders.map((order) => (
						<motion.div
							key={order.id}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							draggable
							onDragStart={(e) =>
								handleDragStart(e as unknown as React.DragEvent, order.id)
							}
							onClick={() => props.onClick && props.onClick(order)}
							className={s["pk-card"]}
						>
							<div className={s["pk-card__header"]}>
								<span>
									Orden: <b>#{order.id}</b>
								</span>
								<span className={s["pk-card__badge"]}>
									{order.items.length} ítems
								</span>
							</div>
							<div className={s["pk-card__items"]}>
								{order.items.map((item) => (
									<div key={item.id} className={s["pk-card__item"]}>
										• {item.name}
									</div>
								))}
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}

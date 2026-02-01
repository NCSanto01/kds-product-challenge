import Logo from "@/bases/Logo/Logo"
import s from "./OrdersLayout.module.scss"
import Riders from "@/components/Riders/Riders"
import Kanban from "@/components/Kanban/Kanban"
import UserSelector from "@/components/UserSelector/UserSelector"

export default function OrdersLayout() {
	return (
		<main className={s["pk-layout"]}>
			<nav className={s["pk-layout__navbar"]}>
				<div className={s["pk-layout__navbar-content"]}>
					<div className={s["pk-layout__navbar-brand"]}>
						<Logo size="M" />
						<strong>KDS: Krazy Display Service</strong>
					</div>
					<UserSelector />
				</div>
			</nav>
			<article className={s["pk-layout__app"]}>
				<Kanban />
				<Riders />
			</article>
		</main>
	)
}

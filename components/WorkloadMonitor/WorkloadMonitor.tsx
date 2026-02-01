import { useOrders } from "@/contexts/Orders.context"
import { useUser } from "@/contexts/User.context"
import classNames from "classnames"
import s from "./WorkloadMonitor.module.scss"

const RADIUS = 30
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function WorkloadMonitor() {
    const { workload } = useOrders()
    const { allUsers } = useUser()

    const workers = allUsers.filter((u) => u.role === "WORKER")

    return (
        <div className={s["pk-workload"]}>
            {workers.map((worker) => {
                const activeOrders = workload.workers[worker.name] || 0
                const percentage = Math.min((activeOrders / workload.max) * 100, 100)
                const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE

                const status =
                    percentage < 50 ? "low" : percentage < 85 ? "medium" : "high"

                return (
                    <div key={worker.id} className={s["pk-workload__item"]}>
                        <div className={s["pk-workload__circle-container"]}>
                            <svg className={s["pk-workload__svg"]} viewBox="0 0 70 70">
                                <circle
                                    className={s["pk-workload__bg-circle"]}
                                    cx="35"
                                    cy="35"
                                    r={RADIUS}
                                />
                                <circle
                                    className={classNames(s["pk-workload__progress-circle"], s[`pk-workload__progress-circle--${status}`])}
                                    cx="35"
                                    cy="35"
                                    r={RADIUS}
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={offset}
                                />
                            </svg>
                            <span className={s["pk-workload__initial"]}>
                                {worker.name.charAt(0)}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

import { useUser } from "@/contexts/User.context"
import { User } from "@/dtos/User.dto"
import s from "./UserSelector.module.scss"

export default function UserSelector() {
    const { currentUser, allUsers, setUser } = useUser()

    const getEmoji = (user: User | null) => (user?.role === "ADMIN" ? "👔" : "👨‍🍳")

    const handleUserChange = (userId: string) => {
        const user = allUsers.find(u => u.id === userId)
        if (user) setUser(user)
    }

    return (
        <div className={s["pk-user-selector"]}>
            <div className={s["pk-user-selector__wrap"]}>
                <span className={s["pk-user-selector__emoji"]}>{getEmoji(currentUser)}</span>
                <select
                    value={currentUser?.id || ""}
                    onChange={(e) => handleUserChange(e.target.value)}
                    className={s["pk-user-selector__select"]}
                >
                    {allUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <span className={s["pk-user-selector__arrow"]}>▾</span>
            </div>
        </div>
    )
}

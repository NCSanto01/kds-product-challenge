import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { User } from "@/dtos/User.dto"
import { useOrders } from "./Orders.context"

export type UserContextProps = {
    currentUser: User | null
    allUsers: User[]
    setUser: (user: User) => void
}

export const UserContext = createContext<UserContextProps>(
    // @ts-ignore
    {},
)

export function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [allUsers, setAllUsers] = useState<User[]>([])
    const { socket } = useOrders()

    useEffect(() => {
        if (!socket) return

        socket.emit("getUsers", (users: User[]) => {
            setAllUsers(users)
            // Default to Admin
            const admin = users.find(u => u.role === "ADMIN")
            if (admin) setCurrentUser(admin)
        })
    }, [socket])

    return (
        <UserContext.Provider value={{ currentUser, allUsers, setUser: setCurrentUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)

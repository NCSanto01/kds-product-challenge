export type UserRole = "ADMIN" | "WORKER";

export type User = {
    id: string;
    name: string;
    role: UserRole;
}

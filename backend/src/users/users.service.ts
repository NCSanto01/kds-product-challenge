import { Injectable } from '@nestjs/common';
import { User } from '../dtos/User.dto';

@Injectable()
export class UsersService {
    private users: User[] = [
        { id: 'admin-1', name: 'Admin', role: 'ADMIN' },
        { id: 'worker-1', name: 'Dani', role: 'WORKER' },
        { id: 'worker-2', name: 'Nico', role: 'WORKER' },
        { id: 'worker-3', name: 'Javi', role: 'WORKER' },
    ];

    getUsers(): User[] {
        return this.users;
    }

    getUserById(id: string): User | undefined {
        return this.users.find((u) => u.id === id);
    }

    getUserByName(name: string): User | undefined {
        return this.users.find((u) => u.name === name);
    }
}

import { User, Prisma, Client, Business } from '@prisma/client';
import { IUser, IUserListOptions, IUserListResult } from './user.interface';

export interface IUserRepository {
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserByPhone(phone: string): Promise<User | null>;
    findUserWithClient(id: string): Promise<User & { client: Client | null } | null>;
    findUsers(options: IUserListOptions): Promise<IUserListResult>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    softDeleteUser(id: string): Promise<void>;
    getClientLocation(userId: string): Promise<{ latitude: number; longitude: number; city: string | null } | null>;
    getManagerBusiness(managerId: string): Promise<Business | null>;
    countUsers(where: Prisma.UserWhereInput): Promise<number>;
    findClientById(userId: string): Promise<Client | null>;
}
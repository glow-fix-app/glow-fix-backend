import { UserEntity, ClientProfileEntity } from '../entities/user.entity';

export interface IUser {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    avatarUrl: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserProfile extends IUser {
    clientLocation?: {
        latitude: number;
        longitude: number;
        city: string | null;
    };
}

export interface IClientProfile extends IUser {
    clientId: string;
    location: {
        latitude: number;
        longitude: number;
        city: string | null;
    } | null;
}

export interface IUserAvatar {
    id: string;
    userId: string;
    url: string;
    storageKey?: string;
    createdAt: Date;
}

export interface IUserListOptions {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    isActive?: boolean;
}

export interface IUserListResult {
    data: IUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
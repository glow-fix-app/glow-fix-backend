import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiProperty({ enum: ['CLIENT', 'MANAGER', 'ADMIN'] })
    role: string;

    @ApiProperty()
    emailVerified: boolean;

    @ApiProperty()
    phoneVerified: boolean;

    @ApiProperty()
    twoFactorEnabled: boolean;

    @ApiPropertyOptional()
    avatarUrl?: string;

    @ApiProperty()
    isActive: boolean;

    @ApiPropertyOptional()
    deletedAt?: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class ClientLocationEntity {
    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiPropertyOptional()
    city?: string;
}

export class ClientProfileEntity extends UserEntity {
    @ApiProperty()
    clientId: string;

    @ApiPropertyOptional({ type: ClientLocationEntity })
    location?: ClientLocationEntity;
}
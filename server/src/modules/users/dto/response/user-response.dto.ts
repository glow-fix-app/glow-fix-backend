import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiProperty()
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

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class ClientLocationResponseDto {
    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiPropertyOptional()
    city?: string;
}

export class UserProfileResponseDto extends UserResponseDto {
    @ApiPropertyOptional({ type: ClientLocationResponseDto })
    clientLocation?: ClientLocationResponseDto;
}
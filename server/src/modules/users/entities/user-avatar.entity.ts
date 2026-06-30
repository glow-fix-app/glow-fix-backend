import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserAvatarEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    url: string;

    @ApiPropertyOptional()
    storageKey?: string;

    @ApiProperty()
    createdAt: Date;
}
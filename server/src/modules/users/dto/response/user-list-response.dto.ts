import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class UserListMetaDto {
    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    totalPages: number;
}

export class UserListResponseDto {
    @ApiProperty({ type: [UserResponseDto] })
    data: UserResponseDto[];

    @ApiProperty({ type: UserListMetaDto })
    meta: UserListMetaDto;
}
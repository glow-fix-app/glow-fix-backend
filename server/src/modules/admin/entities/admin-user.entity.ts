import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminUserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty({ enum: ['CLIENT', 'MANAGER', 'ADMIN'] })
  role: string;

  @ApiProperty()
  email_verified: boolean;

  @ApiProperty()
  phone_verified: boolean;

  @ApiProperty()
  is_active: boolean;

  @ApiPropertyOptional()
  avatar_url?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class AdminUserDetailsEntity extends AdminUserEntity {
  @ApiPropertyOptional()
  client_id?: string;

  @ApiPropertyOptional()
  total_bookings?: number;

  @ApiPropertyOptional()
  total_spent?: number;

  @ApiPropertyOptional()
  loyalty_points?: number;

  @ApiPropertyOptional()
  business_id?: string;

  @ApiPropertyOptional()
  business_name?: string;
}

export class UserListMetaEntity {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

export class UserListResponseEntity {
  @ApiProperty({ type: [AdminUserEntity] })
  data: AdminUserEntity[];

  @ApiProperty({ type: UserListMetaEntity })
  meta: UserListMetaEntity;
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  device_info: string;

  @ApiPropertyOptional()
  ip_address?: string;

  @ApiPropertyOptional()
  user_agent?: string;

  @ApiProperty()
  last_used_at: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  expires_at: Date;

  @ApiProperty()
  is_current: boolean;
}

export class RevokeSessionDto {
  @ApiProperty({ description: 'Session ID to revoke' })
  session_id: string;
}
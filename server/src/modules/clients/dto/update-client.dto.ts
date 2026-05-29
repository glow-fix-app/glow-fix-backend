// dto/update-client.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateClientDto {
  @ApiPropertyOptional({ description: 'Marketing consent preference' })
  @IsOptional()
  @IsBoolean()
  marketing_consent?: boolean;

  // Note: full_name, email, phone are updated via Users module
  // This DTO is for client-specific fields only
}
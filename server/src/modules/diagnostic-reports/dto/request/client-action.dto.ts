import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsArray, IsUUID, IsOptional } from 'class-validator';
import { ClientAction } from '../../constants/diagnostic-report.constants';

export class ClientActionDto {
  @ApiProperty({ enum: ClientAction, description: 'Client action on report' })
  @IsEnum(ClientAction)
  action: ClientAction;

  @ApiPropertyOptional({ description: 'Selected repair IDs to proceed with (if accepted)' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  selected_repair_ids?: string[];
}

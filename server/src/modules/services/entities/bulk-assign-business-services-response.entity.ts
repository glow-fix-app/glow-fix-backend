import { ApiProperty } from '@nestjs/swagger';
import { AssignedBusinessServiceEntity } from './business-service.entity';

export class BulkAssignBusinessServicesResponseEntity {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  assigned_count: number;

  @ApiProperty()
  skipped_count: number;

  @ApiProperty({ type: [AssignedBusinessServiceEntity] })
  assigned_services: AssignedBusinessServiceEntity[];

  @ApiProperty({ type: [String] })
  skipped_services: string[];
}

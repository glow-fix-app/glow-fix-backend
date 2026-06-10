import { ApiProperty } from '@nestjs/swagger';

export class RecommendedRepairEntity {
  @ApiProperty({ description: 'Repair recommendation ID' })
  id: string;

  @ApiProperty({ description: 'Diagnostic report ID' })
  report_id: string;

  @ApiProperty({ description: 'Business service ID' })
  business_service_id: string;

  @ApiProperty({ description: 'Catalog service title' })
  service_title: string;

  @ApiProperty({ description: 'Service price (in EGP/piastres as mapped)' })
  price: number;

  @ApiProperty({ description: 'Average duration in minutes' })
  average_duration: number;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}

import { ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessStatusEntity {
  @ApiPropertyOptional({ nullable: true })
  latestStatus: string | null;

  @ApiPropertyOptional({ nullable: true })
  latestRejectionReason: string | null;
}

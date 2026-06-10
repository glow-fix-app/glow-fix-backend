import { ApiProperty } from '@nestjs/swagger';

export class CategorySummaryEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'WASH' })
  name: string;

  @ApiProperty()
  created_at: Date;
}

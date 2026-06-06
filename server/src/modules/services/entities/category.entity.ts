import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'WASH' })
  name: string;

  @ApiProperty()
  created_at: Date;
}
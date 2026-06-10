import { ApiProperty } from '@nestjs/swagger';

export class ToggleBusinessServiceResponseEntity {
  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  message: string;
}

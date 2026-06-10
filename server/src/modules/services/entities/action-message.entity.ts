import { ApiProperty } from '@nestjs/swagger';

export class ActionMessageEntity {
  @ApiProperty()
  message: string;
}

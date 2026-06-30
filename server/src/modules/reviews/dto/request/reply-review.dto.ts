import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReplyReviewDto {
  @ApiProperty({ description: 'Reply text from the business manager', maxLength: 1000 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  reply: string;
}

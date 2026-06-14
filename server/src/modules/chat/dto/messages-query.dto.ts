import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';

export class MessagesQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit = 30;

  @IsOptional()
  @IsString()
  cursor?: string;
}

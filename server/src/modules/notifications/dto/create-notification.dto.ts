import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  recipientUserId!: string;

  @IsOptional()
  @IsUUID()
  actorUserId?: string;

  @IsString()
  @MaxLength(120)
  typeCode!: string;

  @IsString()
  @MaxLength(180)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  body?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  actionUrl?: string;
}

import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum ConversationCreateType {
  SUPPORT = 'SUPPORT',
  GENERAL = 'GENERAL',
  BOOKING = 'BOOKING',
}

export class CreateConversationDto {
  @IsEnum(ConversationCreateType)
  type!: ConversationCreateType;

  @IsOptional()
  @IsUUID()
  bookingId?: string;
}

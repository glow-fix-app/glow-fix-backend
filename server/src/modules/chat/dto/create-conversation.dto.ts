import { IsArray, IsEnum, IsOptional, IsUUID, IsString } from 'class-validator';

export enum ConversationCreateType {
  SUPPORT = 'SUPPORT',
  GENERAL = 'GENERAL',
  BOOKING = 'BOOKING',
}

export class CreateConversationDto {
  @IsEnum(ConversationCreateType)
  type!: ConversationCreateType;

  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsUUID()
  targetUserId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  participantUserIds?: string[];
}

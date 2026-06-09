import { IsUUID, IsArray, IsNotEmpty, IsISO8601, IsString, ArrayMinSize, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @IsUUID()
  @IsNotEmpty()
  businessId: string;

  @IsISO8601()
  @IsNotEmpty()
  scheduledAt: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  @IsNotEmpty({ each: true })
  businessServiceIds: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

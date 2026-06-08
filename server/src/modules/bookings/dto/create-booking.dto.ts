import { IsUUID, IsArray, IsNotEmpty, IsISO8601, IsString, ArrayMinSize } from 'class-validator';

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

  // @IsString()
  // @IsNotEmpty()
  // paymentMethod: string;
}

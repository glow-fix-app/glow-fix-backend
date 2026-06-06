import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientLocation {
  @ApiProperty({ example: 30.0444 })
  latitude: number;

  @ApiProperty({ example: 31.2357 })
  longitude: number;
}

export class ClientEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiPropertyOptional({ type: ClientLocation })
  location?: ClientLocation;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// export class ClientLocation {
//   @ApiProperty({ example: 30.0444, description: 'Latitude' })
//   latitude: number;

//   @ApiProperty({ example: 31.2357, description: 'Longitude' })
//   longitude: number;
// }

// export class ClientEntity {
//   @ApiProperty({ description: 'Client record ID' })
//   id: string;

//   @ApiProperty({ description: 'Associated user ID' })
//   user_id: string;

//   @ApiPropertyOptional({ description: 'Client location', type: ClientLocation })
//   location?: ClientLocation;

//   @ApiProperty({ description: 'Created at timestamp' })
//   created_at: Date;

//   @ApiProperty({ description: 'Updated at timestamp' })
//   updated_at: Date;
// }

// export class ClientWithUserEntity extends ClientEntity {
//   @ApiProperty({ description: 'User full name' })
//   full_name: string;

//   @ApiProperty({ description: 'User email' })
//   email: string;

//   @ApiPropertyOptional({ description: 'User phone number' })
//   phone?: string;

//   @ApiPropertyOptional({ description: 'User avatar URL' })
//   avatar_url?: string;

//   @ApiProperty({ description: 'Email verification status' })
//   email_verified: boolean;

//   @ApiProperty({ description: 'Phone verification status' })
//   phone_verified: boolean;

//   @ApiProperty({ description: 'User role' })
//   role: string;
// }
import { ApiProperty } from '@nestjs/swagger';

export class ChatUserEntity {
  @ApiProperty({ description: 'User ID' })
  id!: string;

  @ApiProperty({ description: 'Full name' })
  fullName!: string;

  @ApiProperty({ description: 'Email address' })
  email!: string;

  @ApiProperty({ description: 'Role of the user' })
  role!: string;

  @ApiProperty({ description: 'User avatar URL', required: false })
  avatar_url?: string;
}

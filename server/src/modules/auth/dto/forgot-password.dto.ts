import { IsString, IsNotEmpty, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email or mobile number' })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
//  @ApiProperty({ example: '123456' })
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
//   otp: string;

//   @ApiProperty({ example: 'NewStr0ng!Pass' })
//   @IsString()
//   @IsNotEmpty()
//   @MinLength(PASSWORD.MIN_LENGTH)
//   @MaxLength(PASSWORD.MAX_LENGTH)
//   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
//     message:
//       'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
//   })
//   newPassword: string;

//   @ApiProperty({ example: 'NewStr0ng!Pass' })
//   @IsString()
//   @IsNotEmpty()
//   confirmPassword: string;
// }
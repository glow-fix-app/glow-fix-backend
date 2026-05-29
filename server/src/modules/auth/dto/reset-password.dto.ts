import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD } from '@glow-fix/utils';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com or +12025551234' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
  otp: string;

  @ApiProperty({ example: 'NewStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD.MIN_LENGTH)
  @MaxLength(PASSWORD.MAX_LENGTH)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
    {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    },
  )
  newPassword: string;

  @ApiProperty({ example: 'NewStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

// export class ResetPasswordDto {
//   @ApiProperty({ example: 'user@example.com or +12025551234' })
//   @IsString()
//   @IsNotEmpty()
//   identifier: string;

//   @ApiProperty({ example: '123456' })
//   otp: string;

//   @ApiProperty({ example: 'NewStr0ng!Pass' })
//   newPassword: string;

//   @ApiProperty({ example: 'NewStr0ng!Pass' })
//   confirmPassword: string;
// }

// import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// import { PASSWORD } from '@glow-fix/utils';

// export class ResetPasswordDto {
//   @ApiProperty({ example: '+12025551234' })
//   @IsString()
//   @IsNotEmpty()
//   mobileNumber: string;

//   @ApiProperty({ example: '123456' })
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
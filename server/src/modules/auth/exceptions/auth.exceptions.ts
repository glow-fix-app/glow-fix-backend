import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class EmailAlreadyExistsException extends BadRequestException {
  constructor() { super('Email already exists'); }
}
export class PhoneAlreadyExistsException extends BadRequestException {
  constructor() { super('Phone already exists'); }
}
export class InvalidCredentialsException extends UnauthorizedException {
  constructor() { super('Invalid credentials'); }
}
export class UserNotFoundException extends BadRequestException {
  constructor() { super('User not found'); }
}
export class EmailNotVerifiedException extends UnauthorizedException {
  constructor() { super('Email not verified'); }
}
export class AccountDeletedException extends UnauthorizedException {
  constructor() { super('Account deleted'); }
}
export class AccountDeactivatedException extends UnauthorizedException {
  constructor() { super('Account deactivated'); }
}
export class MfaRequiredException extends UnauthorizedException {
  constructor() { super('MFA required'); }
}
export class MfaNotEnabledException extends BadRequestException {
  constructor() { super('MFA not enabled'); }
}
export class InvalidMfaCodeException extends UnauthorizedException {
  constructor() { super('Invalid MFA code'); }
}
export class TooManyLoginAttemptsException extends UnauthorizedException {
  constructor() { super('Too many login attempts. Please try again later.'); }
}
export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() { super('Invalid refresh token'); }
}
export class ResetTokenExpiredException extends BadRequestException {
  constructor() { super('Reset token has expired'); }
}
export class AdminOnlyException extends UnauthorizedException {
  constructor() { super('Admin access required'); }
}
export class SamePasswordException extends BadRequestException {
  constructor() { super('New password cannot be the same as the old password'); }
}
export class PasswordReusedException extends BadRequestException {
  constructor() { super('Password was recently used'); }
}
export class CurrentPasswordIncorrectException extends UnauthorizedException {
  constructor() { super('Current password is incorrect'); }
}

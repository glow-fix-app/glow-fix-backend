import { BadRequestException, Injectable } from '@nestjs/common';

/**
 * Stateless auth validation helpers.
 *
 * Business-rule validations that cannot be expressed with class-validator
 * decorators alone (e.g. cross-field checks between two optional fields)
 * live here. Everything that *can* be expressed with class-validator
 * decorators belongs in the DTOs instead.
 */
@Injectable()
export class AuthValidator {
  /**
   * At least one of `email` or `phone` must be supplied.
   * Used by verifyOtp / resendOtp where both fields are optional
   * but one is required to identify the user.
   */
  static validateIdentifier(email?: string, phone?: string): void {
    if (!email && !phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }
  }
}

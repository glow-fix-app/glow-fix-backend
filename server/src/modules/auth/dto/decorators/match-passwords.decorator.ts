import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Cross-field validator that checks `confirmPassword` matches `newPassword`
 * (or `password` if `newPassword` is absent, e.g. on registration DTOs).
 *
 * Usage:
 *   @MatchPasswords('password')
 *   confirmPassword: string;
 */
export function MatchPasswords(
  relatedPropertyName: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      name: 'matchPasswords',
      target: (object as { constructor: new (...args: unknown[]) => unknown }).constructor,
      propertyName: String(propertyName),
      constraints: [relatedPropertyName],
      options: {
        message: 'Passwords do not match',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyKey] = args.constraints as [string];
          const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyKey];
          return value === relatedValue;
        },
      },
    });
  };
}

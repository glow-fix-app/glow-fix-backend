import { BaseRegisterDto } from './base-register.dto';

/**
 * Only an authenticated ADMIN can POST to /auth/register/admin.
 * The route is NOT decorated with @Public(), so the JWT guard enforces
 * authentication. The service then verifies role === 'ADMIN' as a
 * second layer of defence.
 */
export class RegisterAdminDto extends BaseRegisterDto {}

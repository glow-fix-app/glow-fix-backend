import { NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { USER_ERRORS } from '../constants/user.constants';

export class UserNotFoundException extends NotFoundException {
    constructor() {
        super(USER_ERRORS.USER_NOT_FOUND);
    }
}

export class EmailAlreadyInUseException extends ConflictException {
    constructor() {
        super(USER_ERRORS.EMAIL_IN_USE);
    }
}

export class PhoneAlreadyInUseException extends ConflictException {
    constructor() {
        super(USER_ERRORS.PHONE_IN_USE);
    }
}

export class UnauthorizedUserAccessException extends ForbiddenException {
    constructor() {
        super(USER_ERRORS.UNAUTHORIZED);
    }
}

export class ClientProfileNotFoundException extends NotFoundException {
    constructor() {
        super(USER_ERRORS.CLIENT_PROFILE_NOT_FOUND);
    }
}

export class AvatarNotFoundException extends NotFoundException {
    constructor() {
        super(USER_ERRORS.AVATAR_NOT_FOUND);
    }
}

export class UnsupportedFileTypeException extends BadRequestException {
    constructor() {
        super(USER_ERRORS.UNSUPPORTED_FILE_TYPE);
    }
}

export class FileTooLargeException extends BadRequestException {
    constructor() {
        super(USER_ERRORS.FILE_TOO_LARGE);
    }
}

export class NoFileProvidedException extends BadRequestException {
    constructor() {
        super(USER_ERRORS.NO_FILE_PROVIDED);
    }
}
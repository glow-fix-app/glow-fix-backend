export const USER_MESSAGES = {
    PROFILE_RETRIEVED: 'Profile retrieved successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    AVATAR_UPLOADED: 'Avatar uploaded successfully',
    AVATAR_DELETED: 'Avatar removed successfully',
    ACCOUNT_DELETED: 'Account deleted successfully',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED_ACCESS: 'You are not authorized to access this resource',
} as const;

export const USER_ERRORS = {
    USER_NOT_FOUND: 'User not found',
    EMAIL_IN_USE: 'Email is already in use',
    PHONE_IN_USE: 'Phone number is already in use',
    UNAUTHORIZED: 'You are not allowed to perform this action',
    CLIENT_PROFILE_NOT_FOUND: 'Client profile not found',
    AVATAR_NOT_FOUND: 'No avatar found for this user',
    UNSUPPORTED_FILE_TYPE: 'Unsupported file type. Allowed: JPEG, PNG, WebP, GIF',
    FILE_TOO_LARGE: 'File too large. Maximum size is 5 MB',
    NO_FILE_PROVIDED: 'No file provided',
} as const;

export const USER_CONSTANTS = {
    AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5 MB
    ALLOWED_AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    AVATAR_CACHE_TTL: 3600, // 1 hour
    AVATAR_FOLDER: 'avatars',
    AVATAR_ENTITY_TYPE: 'USER_AVATAR',
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
} as const;
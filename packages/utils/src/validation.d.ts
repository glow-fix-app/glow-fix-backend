export declare function isValidEmail(email: string): boolean;
export declare function isValidPhone(phone: string): boolean;
export declare function validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
};
export declare function isValidLicensePlate(plate: string): boolean;
export declare function isValidVehicleYear(year: number): boolean;
export declare function isValidOtp(otp: string): boolean;
export declare function isValidUuid(id: string): boolean;
export declare function isValidCoordinates(lat: number, lng: number): boolean;
export declare function sanitizeString(input: string): string;

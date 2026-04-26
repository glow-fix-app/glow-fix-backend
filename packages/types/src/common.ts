export type UUID = string;
export type Timestamp = Date;
export type Cents = number; // all money in cents

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
    requestId: string;
    timestamp: string;
    docs?: string;
  };
}

export interface JWTPayload {
  sub: UUID;
  role: string;
  permissions: string[];
  sessionId: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}
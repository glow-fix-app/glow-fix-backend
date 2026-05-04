// ─── Base Types ───
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletable {
  deletedAt: Date | null;
}

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// ─── API Response Types ───
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    correlationId: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// ─── Coordinate Type ───
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// ─── Date Range ───
export interface DateRange {
  start: Date;
  end: Date;
}

// ─── File Upload ───
export interface UploadedFile {
  url: string;
  key: string;
  bucket: string;
  mimetype: string;
  size: number;
}
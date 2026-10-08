import type { Collection } from './collection.js';

export type ApiErrorCode =
  'VALIDATION_ERROR' | 'DUPLICATE_COLLECTION' | 'NOT_FOUND' | 'INTERNAL_ERROR';

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: ValidationIssue[];
}

export interface ApiErrorResponse {
  error: ApiError;
}

export interface ApiDataResponse<T> {
  data: T;
}

export type CreateCollectionResponse = ApiDataResponse<Collection>;
export type CollectionListResponse = ApiDataResponse<Collection[]>;

export interface ApiEnvelope<T> {
  session_id: string;
  count: number | null;
  data: T;
  metadata?: unknown;
}

export interface IBaseResponseList<T> {
  items: T[];
  limit: number;
  total?: number;
}

export interface IBaseResponse<T> {
  data: T;
  // TODO vincent: review later
  metadata: any;
}

// Cursor
export interface ICursorResponse<T> extends IBaseResponseList<T> {
  next_cursor?: string;
}

export interface ICursorParams {
  cursor?: string;
  limit?: number;
}

// Pagination
export interface IPaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> extends IBaseResponseList<T> {
  page: number;
  total_pages?: number;
}

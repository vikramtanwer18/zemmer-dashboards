export type ApiStatus = "success" | "fail" | "error";

export interface ApiResponse<T> {
  status: ApiStatus;
  message?: string;
  data: T;
}

export interface ApiErrorPayload {
  status: "fail" | "error";
  message: string;
  errors?: Record<string, string[] | string>;
  code?: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: Record<string, string[] | string>;

  constructor(
    message: string,
    status: number,
    code?: string,
    fieldErrors?: Record<string, string[] | string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

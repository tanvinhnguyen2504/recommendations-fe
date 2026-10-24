export const ERROR_CODE = {
  VALIDATION_ERROR: 40001,
  UNAUTHENTICATED: 40101,
  FORBIDDEN: 40301,
  RATE_LIMITED: 42901,
  INTERNAL: 50001,
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

export interface ApiError {
  error: {
    code: ErrorCode;
    message: string;
  };
}

export const LOGIN_ERROR = {
  CANCELLED: 40102,
  LOGIN_FAILED: 40103,
  FORBIDDEN: 40302,
  SERVER_ERROR: 50002,
} as const;

export type LoginErrorCode = (typeof LOGIN_ERROR)[keyof typeof LOGIN_ERROR];

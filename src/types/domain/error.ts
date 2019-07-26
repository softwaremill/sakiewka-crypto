export interface ErrorDetails {
  message: string
  code: string
}

export interface ApiError {
  errors: ApiErrorDetails[]
  code?: number
}

export interface ApiErrorDetails {
  message: string
  code: string
}

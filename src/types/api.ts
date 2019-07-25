export interface ApiError {
  errors: ApiErrorDetails[]
  code?: number
}

export interface ApiErrorDetails {
  message: string
  code: string
}

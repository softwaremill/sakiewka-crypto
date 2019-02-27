export interface ApiError {
  errors: ApiErrorDetails[]
}

export interface ApiErrorDetails {
  message: string,
  code: string
}

export interface RequestModel {
  fields: object,
  headers: String[]
}
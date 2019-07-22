export interface ApiError {
  errors: ApiErrorDetails[],
  code?: string,
}

export interface ApiErrorDetails {
  message: string,
  code: string
}

export interface RequestModel {
  fields: object,
  headers: String[]
}
export interface ApiError {
  error: {
    message: string
  }
}

export interface RequestModel {
  fields: object,
  headers: String[]
}

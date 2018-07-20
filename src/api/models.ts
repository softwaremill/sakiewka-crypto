export interface ApiError {
  code: number,
  message: string
}

export const registerRequest = {
  password: {
    required: true,
    type: 'string'
  },
  login: {
    required: true,
    type: 'string'
  }
}

export const loginRequest = {
  password: {
    required: true,
    type: 'string'
  },
  login: {
    required: true,
    type: 'string'
  }
}

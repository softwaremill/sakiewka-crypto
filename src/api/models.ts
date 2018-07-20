export const registerRequest = {
  fields: {
    password: {
      required: true,
      type: 'string'
    },
    login: {
      required: true,
      type: 'string'
    }
  },
  headers: []
}

export const loginRequest = {
  fields: {
    password: {
      required: true,
      type: 'string'
    },
    login: {
      required: true,
      type: 'string'
    }
  },
  headers: []
}

export const infoRequest = {
  fields: {},
  headers: [
    'Authorization'
  ]
}

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

export const createWalletRequest = {
  fields: {
    label: {
      required: true,
      type: 'string'
    },
    userPubKey: {
      required: false,
      type: 'string'
    },
    backupPubKey: {
      required: false,
      type: 'string'
    },
    passphrase: {
      required: true,
      type: 'string'
    }
  },
  headers: [
    'Authorization'
  ]
}

export const createKeyRequest = {
  fields: {
    passphrase: {
      required: false,
      type: 'string'
    }
  },
  headers: []
}

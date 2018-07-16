import crypto from 'crypto'
import sjcl from 'sjcl'

export const encrypt = (password: string, input: string) => {
  const randomSalt = sjcl.random.randomWords(2, 0)
  const encryptOptions = { iter: 10000, ks: 256, salt: randomSalt }

  return sjcl.encrypt(password, input, encryptOptions)
}

export const getRandomBytes = crypto.randomBytes

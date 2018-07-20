import crypto from 'crypto'
import sjcl from 'sjcl'

export const encrypt = (password: string, input: string) => {
  const randomSalt = sjcl.random.randomWords(2, 0)
  const encryptOptions = { iter: 10000, ks: 256, salt: randomSalt }

  return sjcl.encrypt(password, input, encryptOptions)
}

export const decrypt = (password: string, input: string) => {
  const encryptOptions = { iter: 10000, ks: 256 }
  return sjcl.decrypt(password, input, encryptOptions)
}

export const hashSha512 = (input: string) => {
  const bitArrayHash = sjcl.hash.sha512.hash(input)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const getRandomBytes = crypto.randomBytes

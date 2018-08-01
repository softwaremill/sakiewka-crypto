import crypto from 'crypto'
// @ts-ignore
import sjcl from 'sjcl-complete'

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

export const hashSha1 = (input: string) => {
  const bitArrayHash = sjcl.hash.sha1.hash(input)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const hashPassword = (input: string) => {
  const salt = hashSha1(input)
  const bitArrayHash = sjcl.misc.scrypt(input, salt)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const getRandomBytes = crypto.randomBytes

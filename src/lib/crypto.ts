import crypto from 'crypto'
import sjcl from 'sjcl'


export const hashWalletPassword = (passphrase: string): string => {
  const salt = hashSha256(passphrase + 'OiCiv)G;9.BF77')
  const outputAsBits = sjcl.misc.pbkdf2(passphrase, salt, 10000, 512)
  return sjcl.codec.hex.fromBits(outputAsBits)
}

export const encrypt = (password: string, input: string): string => {
  const randomSalt = sjcl.random.randomWords(2, 0)
  const randomIV = sjcl.random.randomWords(2, 0)
  const encryptOptions = { iter: 10000, ks: 256, salt: randomSalt, iv: randomIV, ts: 96 }
  return sjcl.encrypt(hashWalletPassword(password), input, encryptOptions)
}

export const decrypt = (password: string, input: string): string => {
  return sjcl.decrypt(hashWalletPassword(password), input)
}

export const hashSha256 = (input: string): string => {
  const bitArrayHash = sjcl.hash.sha256.hash(input)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const hashUserPassword = (password: string): string => {
  const salt = hashSha256(password + ']KDH.@^CdKt@Jq')
  const bitArrayHash = sjcl.misc.pbkdf2(password, salt,1000,256)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const getRandomBytes = crypto.randomBytes

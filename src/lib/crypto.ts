import crypto from 'crypto'
import sjcl from 'sjcl'

export const encrypt = (password: string, input: string): string => {
  const randomSalt = sjcl.random.randomWords(2, 0)
  const randomIV = sjcl.random.randomWords(2, 0)
  const { key: pbkdf2Key, salt: pbkdf2Salt } = sjcl.misc.cachedPbkdf2(password);
  const encryptOptions = { iter: 10000, ks: 256, salt: randomSalt, iv: randomIV, ts: 96, pbkdf2Salt }
  return sjcl.encrypt(pbkdf2Key.toString(), input, encryptOptions).toString()
}

export const decrypt = (password: string, input: string): string => {
  const pbkdf2Salt = sjcl.codec.base64.toBits(JSON.parse(input).pbkdf2Salt)
  const { key: pbkdf2Key } = sjcl.misc.cachedPbkdf2(password, { salt: pbkdf2Salt })
  return sjcl.decrypt(pbkdf2Key.toString(), input)
}

export const hashSha256 = (input: string): string => {
  const bitArrayHash = sjcl.hash.sha256.hash(input)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const hashPassword = (password: string): string => {
  const salt = hashSha256(password + ']KDH.@^CdKt@Jq')
  const bitArrayHash = sjcl.misc.pbkdf2(password, salt, 1000, 256)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const getRandomBytes = crypto.randomBytes

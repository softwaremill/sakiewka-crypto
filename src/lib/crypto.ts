import crypto from 'crypto'
import sjcl from 'sjcl'

/*
  Password is derived to pbkdf2 key with random salt.
  The input is then encrypted with the key using another random salt and random IV (initialization vector).
  The result of encryption is json object including the encrypted message as well as
  pbkdf2 salt, encryption salt and iv. These values are randomly generated thus need to be stored for later decryption.
  Description of all parameters can be found here - http://bitwiseshiftleft.github.io/sjcl/demo/
 */
export const encrypt = (password: string, input: string): string => {
  const { key: pbkdf2Key, salt: pbkdf2Salt } = sjcl.misc.cachedPbkdf2(password)
  const encryptionSalt = sjcl.random.randomWords(2, 0)
  const iv = sjcl.random.randomWords(2, 0)
  const encryptOptions = {
    iter: 10000,
    ks: 256,
    salt: encryptionSalt,
    iv,
    ts: 96,
    pbkdf2Salt,
  }
  return sjcl.encrypt(pbkdf2Key.toString(), input, encryptOptions).toString()
}

export const decrypt = (password: string, input: string): string => {
  const pbkdf2Salt = sjcl.codec.base64.toBits(JSON.parse(input).pbkdf2Salt)
  const { key: pbkdf2Key } = sjcl.misc.cachedPbkdf2(password, {
    salt: pbkdf2Salt,
  })
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

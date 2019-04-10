import crypto from 'crypto'
import sjcl from 'sjcl-complete'


export const pbkdf2 = (passphrase:string) : string => {
  const passphraseAsBits = sjcl.codec.utf8String.toBits(passphrase)
  const salt = '0fabdd8eab54b3e678658c06b17bb5de839380bbc66593f8573d45e80bbe082e';
  const outputAsBits = sjcl.misc.pbkdf2(passphraseAsBits,salt,10000,512)
  return sjcl.codec.hex.fromBits(outputAsBits)
}

export const encrypt = (password: string, input: string): string => {
  const randomSalt = sjcl.random.randomWords(2, 0)
  const encryptOptions = { iter: 10000, ks: 256, salt: randomSalt }

  return sjcl.encrypt(pbkdf2(password), input, encryptOptions)
}

export const decrypt = (password: string, input: string): string => {
  const encryptOptions = { iter: 10000, ks: 256 }
  return sjcl.decrypt(pbkdf2(password), input, encryptOptions)
}

export const hashSha512 = (input: string): string => {
  const bitArrayHash = sjcl.hash.sha512.hash(input)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const hashSha1 = (input: string): string => {
  const bitArrayHash = sjcl.hash.sha1.hash(input)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const hashPassword = (input: string): string => {
  const salt = hashSha1(input)
  const bitArrayHash = sjcl.misc.scrypt(input, salt)
  const stringHash = sjcl.codec.hex.fromBits(bitArrayHash)

  return stringHash
}

export const getRandomBytes = crypto.randomBytes

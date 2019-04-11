export as namespace sjclComplete

export function encrypt(password: string, plaintext: string, params?: object, rp?: object): string

export function decrypt(password: string, json: string, params?: object): string

export namespace random {
  export function randomWords(nwords: number, paranoia: number): string
}

export namespace hash {
  export namespace sha512 {
    export function hash(input: string)
  }
  export namespace sha1 {
    export function hash(input: string)
  }
}

export namespace misc {
  export function scrypt(input: string, salt: string)

  export function pbkdf2(password: string, salt: string, iter: number, length: number)
}

export namespace codec {
  export namespace hex {
    export function fromBits(input: String[])
  }
  export namespace utf8String {
    export function toBits(input: string)
  }
}
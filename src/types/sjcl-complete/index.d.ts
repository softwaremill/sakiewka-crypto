export as namespace sjcl

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
}

export namespace codec {
  export namespace hex {
    export function fromBits(input: String[])
  }
}
export as namespace sjc

export function encrypt(password: string, plaintext: string, params?: object, rp?: object): string

export namespace random {
  export function randomWords(nwords: number, paranoia: number): string
}
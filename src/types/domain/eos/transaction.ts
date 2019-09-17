export interface Transaction<T extends ActionData> {
  expiration: string
  ref_block_num: number
  ref_block_prefix: number
  actions: Action<T>[]
}

export interface Action<T> {
  account: string
  name: string
  authorization: Authorization[]
  data: T
}

export interface Authorization {
  actor: string
  permission: string
}

export interface ActionData {}

export interface TransferActionData extends ActionData {
  from: string
  to: string
  quantity: string
  memo: string
}

import { expect } from 'chai'

import * as transaction from '../transaction'
import * as backendApi from '../../backend-api'

// @ts-ignore
backendApi.ethGetTransactionParams = jest.fn(() => {
  return Promise.resolve({
    gasLimit: '123',
    gasPrice: '123',
    nonce: 10,
    contractNonce: 213
  })
})

// @ts-ignore
backendApi.ethSendTransaction = jest.fn(() => {
  return Promise.resolve({ status: 'ok' })
})

process.env.ETH_PRV_KEY = 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'

describe('send', () => {
  it('should exist', () => {
    expect(transaction.send).to.be.a('function')
  })

  it('should send transaction', async () => {
    const passphrase = 'abcd'
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
    const amount = 1000000000

    const result = await transaction.send(passphrase, address, amount)
    expect(result.status).to.eq('ok')
  })
})

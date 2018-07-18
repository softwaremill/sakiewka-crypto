import { expect } from 'chai'
import bitcoinjsLib from 'bitcoinjs-lib'
import sjcl from 'sjcl'

import * as transaction from '../transaction'
import * as backendApi from '../backend-api'
import { encrypt, decrypt } from '../crypto'

describe('sendTransaction', () => {
  it('should exist', () => {
    expect(transaction.sendTransaction).to.be.a('function')
  })
})

describe('sendCoins', () => {
  it('should exist', () => {
    expect(transaction.sendCoins).to.be.a('function')
  })

  it('should send coins', async () => {
    const encryptedXprv = encrypt(
      'abcd',
      'xprv9zMivqcNYr3wLpY1Zr8wQHkMhAHtfk8UqpRe4hJBS19ucEv2PugtmjrRxrqyYHuyU5X1xcBcZXWsoEvrHh6s7WfZsx3ooREwWWhaPJ8BWzU'
    )

    backendApi.getWalletDetailed = jest.fn(() => {
      return Promise.resolve({
        id: 13,
        unspents: [
          {
            txId: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
            index: 0
          },
          {
            txId: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b15',
            index: 1
          }
        ],
        addresses: {
          change: [],
          receive: []
        },
        keychains: [
          { encryptedXprv, label: 'user',  xpub: 'bbb' }
        ]
      })
    })

    const result = await transaction.sendCoins({
      walletId: 13,
      walletPassphrase: 'abcd',
      destinationAddress: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
      amount: 5
    })

    expect(transaction.sendCoins).to.be.a('function')
  })
})

import { expect } from 'chai'
import moment from 'moment'
import { eosTransactionModuleFactory } from '../../eos/eos-transaction'
import { TransferActionData } from '../../../types/domain/eos/transaction'

const eosModule = eosTransactionModuleFactory(
  '8be32650b763690b95b7d7e32d7637757a0a7392ad04f1c393872e525a2ce82b',
)

describe('eos transaction', () => {
  it('should create offline transfer transaction', async () => {
    const currentTime = moment('2019-08-21T10:21:41.433')
    const blockNumber = 17
    const refBlockPrefix = 4010820182
    const tx = await eosModule.createTransferTx(
      blockNumber,
      refBlockPrefix,
      'someaccount2',
      'accfeeclctor',
      { amount: '5.0000', currency: 'EOS' },
      { amount: '0.5', serviceAddress: 'srvceaccount' },
      currentTime,
      'x',
    )
    expect(tx).to.be.eq(
      '3d225d5d1100564210ef000000000200a6823403ea3055000000572d3ccdcd0120f2d41421a324c500000000a8ed32322220f2d41421a324c57069461129b5103250c300000000000004454f5300000000017800a6823403ea3055000000572d3ccdcd0120f2d41421a324c500000000a8ed32322120f2d41421a324c590a7a6081985f6c5881300000000000004454f53000000000000',
    )
  })

  it('should sign offline transaction', async () => {
    const tx =
      '3d225d5d1100564210ef000000000100a6823403ea3055000000572d3ccdcd0120f2d41421a324c500000000a8ed32322220f2d41421a324c57069461129b5103250c300000000000004454f5300000000017800'
    const prvKey1 = '5Hs6S4X9QAZLerdZMB8nBtAredayD9TVUrHnP844nfaxFE2nja9'
    const signature1 = await eosModule.signTx(prvKey1, tx)
    expect(signature1).to.be.eq(
      'SIG_K1_KikBPiUSsTtW2Kny11SBDx2bVu6ASMyvcsqTL1t3vgX4SaHvAG6bRmqVA6mwTFPVEAaNGbuRcaPuydr6X1kfHD4mhS8RFw',
    )

    const prvKey2 = '5JZWMNz5uiUkuEM9m6x8PzaztnxJHdgGFSSLqNX9WsZudYiJzFb'
    const signature2 = await eosModule.signTx(prvKey2, tx)
    expect(signature2).to.be.eq(
      'SIG_K1_K2T2YnkZ2YkcgkBfANMrdvAfqr7d9PqavRX7Kfrstta6XEgQNu7XFENeuKvKaxCziLxY5ETH8yoA5nzbpmsEVqATuqpU5M',
    )
  })

  it('should decode transfer transaction', async () => {
    const txHex =
      '3d225d5d1100564210ef000000000100a6823403ea3055000000572d3ccdcd0120f2d41421a324c500000000a8ed32322220f2d41421a324c57069461129b5103250c300000000000004454f5300000000017800'
    const tx = await eosModule.decodeTransferTransaction(txHex)
    expect(tx.expiration).to.be.eq('2019-08-21T10:51:41.000')
    expect(tx.ref_block_num).to.be.eq(17)
    expect(tx.ref_block_prefix).to.be.eq(4010820182)
    expect(tx.actions[0].account).to.be.eq('eosio.token')
    expect(tx.actions[0].name).to.be.eq('transfer')
    expect(tx.actions[0].authorization[0].actor).to.be.eq('someaccount2')
    expect(tx.actions[0].authorization[0].permission).to.be.eq('active')
    expect((tx.actions[0].data as TransferActionData).from).to.be.eq(
      'someaccount2',
    )
    expect((tx.actions[0].data as TransferActionData).to).to.be.eq(
      'accfeeclctor',
    )
    expect((tx.actions[0].data as TransferActionData).quantity).to.be.eq(
      '5.0000 EOS',
    )
    expect((tx.actions[0].data as TransferActionData).memo).to.be.eq('x')
  })
})

import { expect } from 'chai'
import { accountModuleFactory } from '../../eos/eos-account'
import moment from 'moment'

describe('eos account', () => {
  it('should create offline signed newaccount transaction', async () => {
    const res = await accountModuleFactory(
      'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    ).buildNewAccountTransaction(
      'newacc',
      'creator',
      '5JLiZAmXhWWhTAab3YEXRSsJm4mybgFmE4DHb6Eqf9KZk9UbBci',
      'EOS7q6ny3Hmbm9oCgUh7NqbfvQauiBqBQRVDB5NH1aQr2QLa4EA3r',
      'EOS6ocq7DSmtpbjtzodGAvLNbwtJUK3mYKvUUG3Sot8CLWtbPgh4g',
      'EOS8AFvsywPipDmqUFiSSZTJWVnb5bk9sCo813jq1ewmd4SGpVsxs',
      1055,
      4035814219,
      moment('2019-12-31'),
    )
    expect(res.signature).to.eq('SIG_K1_Kat8Q7vUsrKo3WMUwzeM4EPTnNfWujB8YqeKSrFz5sx83hy1EXxqYg4dvUdBt6huAJkABHX4b6DoPpRpey5NVGV3QzkeKg', JSON.stringify(res),)
    expect(res.serializedTransaction).to.eq('88960a5e1f044ba38df000000000030000000000ea305500409e9a2264b89a01000000e0d26cd44500000000a8ed3232ae01000000e0d26cd445000000002064b89a01000000010003aee489123e488124be1446fb7a84b1bff66e1c534f62dd323afe1508af357c3401000000020000000300038364a9a0a424b73670c160713ac49366808051093b02db5131d0bd40dbfe380301000002fc54ef6b50d6ea072d64ec13cd50619398bd18281bdceb6e577032b38321aba201000003aee489123e488124be1446fb7a84b1bff66e1c534f62dd323afe1508af357c34010000000000000000ea305500b0cafe4873bd3e01000000e0d26cd44500000000a8ed323214000000e0d26cd445000000002064b89a002000000000000000ea305500003f2a1ba6a24a01000000e0d26cd44500000000a8ed323231000000e0d26cd445000000002064b89a10270000000000000453595300000000102700000000000004535953000000000000', JSON.stringify(res))
  })
})

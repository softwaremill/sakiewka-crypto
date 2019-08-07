import { expect } from 'chai'
import { buildNewAccountTransaction } from '../../eos/eos-account'
import moment from "moment";

describe('eos account', () => {
  it('should create offline signed newaccount transaction', async () => {
    const res = await buildNewAccountTransaction(
      'newacc',
      'creator',
      '5JLiZAmXhWWhTAab3YEXRSsJm4mybgFmE4DHb6Eqf9KZk9UbBci',
      'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
      'EOS7q6ny3Hmbm9oCgUh7NqbfvQauiBqBQRVDB5NH1aQr2QLa4EA3r',
      'EOS6ocq7DSmtpbjtzodGAvLNbwtJUK3mYKvUUG3Sot8CLWtbPgh4g',
      'EOS8AFvsywPipDmqUFiSSZTJWVnb5bk9sCo813jq1ewmd4SGpVsxs',
      1055,
      4035814219,
      moment("2019-12-31")
    )
    expect(res.signatures).to.deep.eq(['SIG_K1_K5o1uAhoY4gPHPWydo6SegkffGtDRts3tyE3LbgLF5LMkkV3qRXHeBhH79YzyCThyS8BszqvMyQCSjBXaJ589Kj4SwBAkt'],JSON.stringify(res))
    expect(res.serializedTransaction).to.be.a('uint8array',JSON.stringify(res))
    expect(res.serializedTransaction.length).to.eq(362)
  })
})
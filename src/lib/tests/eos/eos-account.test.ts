import { expect } from 'chai'
import { eosAccountModuleFactory } from '../../eos/eos-account'
import moment from 'moment'
import { Api, JsonRpc } from 'eosjs'
import { BinaryAbi } from 'eosjs/dist/eosjs-api-interfaces'
import { base64ToBinary } from 'eosjs/dist/eosjs-numeric'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { eosTransactionModuleFactory } from '../../eos/eos-transaction'

const { TextDecoder, TextEncoder } = require('util')

describe('eos account', () => {
  it('should create offline signed newaccount transaction', async () => {
    const res = await eosAccountModuleFactory(
      eosTransactionModuleFactory(
        'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
      ),
    ).buildNewAccountTransaction(
      'newacc',
      'creator',
      '5JLiZAmXhWWhTAab3YEXRSsJm4mybgFmE4DHb6Eqf9KZk9UbBci',
      'PUB_K1_7q6ny3Hmbm9oCgUh7NqbfvQauiBqBQRVDB5NH1aQr2QLab1R3B',
      'PUB_K1_6ocq7DSmtpbjtzodGAvLNbwtJUK3mYKvUUG3Sot8CLWtbaw3Vk',
      'PUB_K1_8AFvsywPipDmqUFiSSZTJWVnb5bk9sCo813jq1ewmd4SGG7qeZ',
      1055,
      4035814219,
      moment('2019-12-31'),
    )
    expect(res.signature).to.eq(
      'SIG_K1_Jx6nt3F1gYq4Y7steiBMo55NWLYsKpkwvtQ5FKLDgv4dA1WXfR584aTy3xr4Zj6PH3T1mTwcWgEfjHXMpBAp2dNMAj8FF5',
      JSON.stringify(res),
    )
    expect(res.serializedTransaction).to.eq(
      '88960a5e1f044ba38df000000000030000000000ea305500409e9a2264b89a01000000e0d26cd44500000000a8ed3232ae01000000e0d26cd445000000002064b89a01000000010003aee489123e488124be1446fb7a84b1bff66e1c534f62dd323afe1508af357c340100000002000000030002fc54ef6b50d6ea072d64ec13cd50619398bd18281bdceb6e577032b38321aba2010000038364a9a0a424b73670c160713ac49366808051093b02db5131d0bd40dbfe380301000003aee489123e488124be1446fb7a84b1bff66e1c534f62dd323afe1508af357c34010000000000000000ea305500b0cafe4873bd3e01000000e0d26cd44500000000a8ed323214000000e0d26cd445000000002064b89a002000000000000000ea305500003f2a1ba6a24a01000000e0d26cd44500000000a8ed323231000000e0d26cd445000000002064b89a10270000000000000453595300000000102700000000000004535953000000000000',
      JSON.stringify(res),
    )
    const builtTx = await deserializeRawTx(res.serializedTransaction)
    const newAccountAction = builtTx.actions[0]
    const buyRamAction = builtTx.actions[1]
    const delegateBWAction = builtTx.actions[2]
    expect(newAccountAction.name).to.eq('newaccount')
    expect(newAccountAction.data.creator).to.eq('creator')
    expect(newAccountAction.data.owner.threshold).to.eq(1)
    expect(newAccountAction.data.owner.keys).to.deep.eq([
      {
        key: 'PUB_K1_8AFvsywPipDmqUFiSSZTJWVnb5bk9sCo813jq1ewmd4SGG7qeZ',
        weight: 1,
      },
    ])
    expect(newAccountAction.data.active.threshold).to.eq(2)
    expect(newAccountAction.data.active.keys).to.deep.eq([
      {
        key: 'PUB_K1_6ocq7DSmtpbjtzodGAvLNbwtJUK3mYKvUUG3Sot8CLWtbaw3Vk',
        weight: 1,
      },
      {
        key: 'PUB_K1_7q6ny3Hmbm9oCgUh7NqbfvQauiBqBQRVDB5NH1aQr2QLab1R3B',
        weight: 1,
      },
      {
        key: 'PUB_K1_8AFvsywPipDmqUFiSSZTJWVnb5bk9sCo813jq1ewmd4SGG7qeZ',
        weight: 1,
      },
    ])
    expect(buyRamAction.name).to.eq('buyrambytes')
    expect(buyRamAction.data.bytes).to.eq(8192)
    expect(buyRamAction.data.receiver).to.eq('newacc')
    expect(delegateBWAction.name).to.eq('delegatebw')
    expect(delegateBWAction.data.receiver).to.eq('newacc')
    expect(delegateBWAction.data.stake_net_quantity).to.eq('1.0000 SYS')
    expect(delegateBWAction.data.stake_cpu_quantity).to.eq('1.0000 SYS')
  })

  const deserializeRawTx = async (txHex: string) => {
    const abiProvider = {
      getRawAbi: (accountName: string): Promise<BinaryAbi> => {
        // This base64 encoded eosio abi with system contract installed (required for buyrambytes and delegatebw actions) - https://github.com/EOS-Mainnet/governance/tree/master/eosio.system
        // Once you install the contract you can get the base64 version by calling curl --request POST --data '{"account_name":"eosio"}' --url http://127.0.0.1:8888/v1/chain/get_raw_abi
        const base64Abi =
          'DmVvc2lvOjphYmkvMS4xAFIIYWJpX2hhc2gAAgVvd25lcgRuYW1lBGhhc2gLY2hlY2tzdW0yNTYJYXV0aG9yaXR5AAQJdGhyZXNob2xkBnVpbnQzMgRrZXlzDGtleV93ZWlnaHRbXQhhY2NvdW50cxlwZXJtaXNzaW9uX2xldmVsX3dlaWdodFtdBXdhaXRzDXdhaXRfd2VpZ2h0W10KYmlkX3JlZnVuZAACBmJpZGRlcgRuYW1lBmFtb3VudAVhc3NldAdiaWRuYW1lAAMGYmlkZGVyBG5hbWUHbmV3bmFtZQRuYW1lA2JpZAVhc3NldAliaWRyZWZ1bmQAAgZiaWRkZXIEbmFtZQduZXduYW1lBG5hbWUMYmxvY2tfaGVhZGVyAAgJdGltZXN0YW1wBnVpbnQzMghwcm9kdWNlcgRuYW1lCWNvbmZpcm1lZAZ1aW50MTYIcHJldmlvdXMLY2hlY2tzdW0yNTYRdHJhbnNhY3Rpb25fbXJvb3QLY2hlY2tzdW0yNTYMYWN0aW9uX21yb290C2NoZWNrc3VtMjU2EHNjaGVkdWxlX3ZlcnNpb24GdWludDMyDW5ld19wcm9kdWNlcnMScHJvZHVjZXJfc2NoZWR1bGU/FWJsb2NrY2hhaW5fcGFyYW1ldGVycwARE21heF9ibG9ja19uZXRfdXNhZ2UGdWludDY0GnRhcmdldF9ibG9ja19uZXRfdXNhZ2VfcGN0BnVpbnQzMhltYXhfdHJhbnNhY3Rpb25fbmV0X3VzYWdlBnVpbnQzMh5iYXNlX3Blcl90cmFuc2FjdGlvbl9uZXRfdXNhZ2UGdWludDMyEG5ldF91c2FnZV9sZWV3YXkGdWludDMyI2NvbnRleHRfZnJlZV9kaXNjb3VudF9uZXRfdXNhZ2VfbnVtBnVpbnQzMiNjb250ZXh0X2ZyZWVfZGlzY291bnRfbmV0X3VzYWdlX2RlbgZ1aW50MzITbWF4X2Jsb2NrX2NwdV91c2FnZQZ1aW50MzIadGFyZ2V0X2Jsb2NrX2NwdV91c2FnZV9wY3QGdWludDMyGW1heF90cmFuc2FjdGlvbl9jcHVfdXNhZ2UGdWludDMyGW1pbl90cmFuc2FjdGlvbl9jcHVfdXNhZ2UGdWludDMyGG1heF90cmFuc2FjdGlvbl9saWZldGltZQZ1aW50MzIeZGVmZXJyZWRfdHJ4X2V4cGlyYXRpb25fd2luZG93BnVpbnQzMhVtYXhfdHJhbnNhY3Rpb25fZGVsYXkGdWludDMyFm1heF9pbmxpbmVfYWN0aW9uX3NpemUGdWludDMyF21heF9pbmxpbmVfYWN0aW9uX2RlcHRoBnVpbnQxNhNtYXhfYXV0aG9yaXR5X2RlcHRoBnVpbnQxNgZidXlyYW0AAwVwYXllcgRuYW1lCHJlY2VpdmVyBG5hbWUFcXVhbnQFYXNzZXQLYnV5cmFtYnl0ZXMAAwVwYXllcgRuYW1lCHJlY2VpdmVyBG5hbWUFYnl0ZXMGdWludDMyBmJ1eXJleAACBGZyb20EbmFtZQZhbW91bnQFYXNzZXQLY2FuY2VsZGVsYXkAAg5jYW5jZWxpbmdfYXV0aBBwZXJtaXNzaW9uX2xldmVsBnRyeF9pZAtjaGVja3N1bTI1NgxjbGFpbXJld2FyZHMAAQVvd25lcgRuYW1lCGNsb3NlcmV4AAEFb3duZXIEbmFtZQxjbmNscmV4b3JkZXIAAQVvd25lcgRuYW1lCWNvbm5lY3RvcgACB2JhbGFuY2UFYXNzZXQGd2VpZ2h0B2Zsb2F0NjQLY29uc29saWRhdGUAAQVvd25lcgRuYW1lCmRlZmNwdWxvYW4AAwRmcm9tBG5hbWUIbG9hbl9udW0GdWludDY0BmFtb3VudAVhc3NldApkZWZuZXRsb2FuAAMEZnJvbQRuYW1lCGxvYW5fbnVtBnVpbnQ2NAZhbW91bnQFYXNzZXQKZGVsZWdhdGVidwAFBGZyb20EbmFtZQhyZWNlaXZlcgRuYW1lEnN0YWtlX25ldF9xdWFudGl0eQVhc3NldBJzdGFrZV9jcHVfcXVhbnRpdHkFYXNzZXQIdHJhbnNmZXIEYm9vbBNkZWxlZ2F0ZWRfYmFuZHdpZHRoAAQEZnJvbQRuYW1lAnRvBG5hbWUKbmV0X3dlaWdodAVhc3NldApjcHVfd2VpZ2h0BWFzc2V0CmRlbGV0ZWF1dGgAAgdhY2NvdW50BG5hbWUKcGVybWlzc2lvbgRuYW1lB2RlcG9zaXQAAgVvd25lcgRuYW1lBmFtb3VudAVhc3NldBJlb3Npb19nbG9iYWxfc3RhdGUVYmxvY2tjaGFpbl9wYXJhbWV0ZXJzDQxtYXhfcmFtX3NpemUGdWludDY0GHRvdGFsX3JhbV9ieXRlc19yZXNlcnZlZAZ1aW50NjQPdG90YWxfcmFtX3N0YWtlBWludDY0HWxhc3RfcHJvZHVjZXJfc2NoZWR1bGVfdXBkYXRlFGJsb2NrX3RpbWVzdGFtcF90eXBlGGxhc3RfcGVydm90ZV9idWNrZXRfZmlsbAp0aW1lX3BvaW50DnBlcnZvdGVfYnVja2V0BWludDY0D3BlcmJsb2NrX2J1Y2tldAVpbnQ2NBN0b3RhbF91bnBhaWRfYmxvY2tzBnVpbnQzMhV0b3RhbF9hY3RpdmF0ZWRfc3Rha2UFaW50NjQbdGhyZXNoX2FjdGl2YXRlZF9zdGFrZV90aW1lCnRpbWVfcG9pbnQbbGFzdF9wcm9kdWNlcl9zY2hlZHVsZV9zaXplBnVpbnQxNhp0b3RhbF9wcm9kdWNlcl92b3RlX3dlaWdodAdmbG9hdDY0D2xhc3RfbmFtZV9jbG9zZRRibG9ja190aW1lc3RhbXBfdHlwZRNlb3Npb19nbG9iYWxfc3RhdGUyAAURbmV3X3JhbV9wZXJfYmxvY2sGdWludDE2EWxhc3RfcmFtX2luY3JlYXNlFGJsb2NrX3RpbWVzdGFtcF90eXBlDmxhc3RfYmxvY2tfbnVtFGJsb2NrX3RpbWVzdGFtcF90eXBlHHRvdGFsX3Byb2R1Y2VyX3ZvdGVwYXlfc2hhcmUHZmxvYXQ2NAhyZXZpc2lvbgV1aW50OBNlb3Npb19nbG9iYWxfc3RhdGUzAAIWbGFzdF92cGF5X3N0YXRlX3VwZGF0ZQp0aW1lX3BvaW50HHRvdGFsX3ZwYXlfc2hhcmVfY2hhbmdlX3JhdGUHZmxvYXQ2NA5leGNoYW5nZV9zdGF0ZQADBnN1cHBseQVhc3NldARiYXNlCWNvbm5lY3RvcgVxdW90ZQljb25uZWN0b3ILZnVuZGNwdWxvYW4AAwRmcm9tBG5hbWUIbG9hbl9udW0GdWludDY0B3BheW1lbnQFYXNzZXQLZnVuZG5ldGxvYW4AAwRmcm9tBG5hbWUIbG9hbl9udW0GdWludDY0B3BheW1lbnQFYXNzZXQEaW5pdAACB3ZlcnNpb24JdmFydWludDMyBGNvcmUGc3ltYm9sCmtleV93ZWlnaHQAAgNrZXkKcHVibGljX2tleQZ3ZWlnaHQGdWludDE2CGxpbmthdXRoAAQHYWNjb3VudARuYW1lBGNvZGUEbmFtZQR0eXBlBG5hbWULcmVxdWlyZW1lbnQEbmFtZQttdmZyc2F2aW5ncwACBW93bmVyBG5hbWUDcmV4BWFzc2V0C212dG9zYXZpbmdzAAIFb3duZXIEbmFtZQNyZXgFYXNzZXQIbmFtZV9iaWQABAduZXduYW1lBG5hbWULaGlnaF9iaWRkZXIEbmFtZQhoaWdoX2JpZAVpbnQ2NA1sYXN0X2JpZF90aW1lCnRpbWVfcG9pbnQKbmV3YWNjb3VudAAEB2NyZWF0b3IEbmFtZQRuYW1lBG5hbWUFb3duZXIJYXV0aG9yaXR5BmFjdGl2ZQlhdXRob3JpdHkHb25ibG9jawABBmhlYWRlcgxibG9ja19oZWFkZXIHb25lcnJvcgACCXNlbmRlcl9pZAd1aW50MTI4CHNlbnRfdHJ4BWJ5dGVzGXBhaXJfdGltZV9wb2ludF9zZWNfaW50NjQAAgVmaXJzdA50aW1lX3BvaW50X3NlYwZzZWNvbmQFaW50NjQQcGVybWlzc2lvbl9sZXZlbAACBWFjdG9yBG5hbWUKcGVybWlzc2lvbgRuYW1lF3Blcm1pc3Npb25fbGV2ZWxfd2VpZ2h0AAIKcGVybWlzc2lvbhBwZXJtaXNzaW9uX2xldmVsBndlaWdodAZ1aW50MTYNcHJvZHVjZXJfaW5mbwAIBW93bmVyBG5hbWULdG90YWxfdm90ZXMHZmxvYXQ2NAxwcm9kdWNlcl9rZXkKcHVibGljX2tleQlpc19hY3RpdmUEYm9vbAN1cmwGc3RyaW5nDXVucGFpZF9ibG9ja3MGdWludDMyD2xhc3RfY2xhaW1fdGltZQp0aW1lX3BvaW50CGxvY2F0aW9uBnVpbnQxNg5wcm9kdWNlcl9pbmZvMgADBW93bmVyBG5hbWUNdm90ZXBheV9zaGFyZQdmbG9hdDY0GWxhc3Rfdm90ZXBheV9zaGFyZV91cGRhdGUKdGltZV9wb2ludAxwcm9kdWNlcl9rZXkAAg1wcm9kdWNlcl9uYW1lBG5hbWURYmxvY2tfc2lnbmluZ19rZXkKcHVibGljX2tleRFwcm9kdWNlcl9zY2hlZHVsZQACB3ZlcnNpb24GdWludDMyCXByb2R1Y2Vycw5wcm9kdWNlcl9rZXlbXQZyZWZ1bmQAAQVvd25lcgRuYW1lDnJlZnVuZF9yZXF1ZXN0AAQFb3duZXIEbmFtZQxyZXF1ZXN0X3RpbWUOdGltZV9wb2ludF9zZWMKbmV0X2Ftb3VudAVhc3NldApjcHVfYW1vdW50BWFzc2V0C3JlZ3Byb2R1Y2VyAAQIcHJvZHVjZXIEbmFtZQxwcm9kdWNlcl9rZXkKcHVibGljX2tleQN1cmwGc3RyaW5nCGxvY2F0aW9uBnVpbnQxNghyZWdwcm94eQACBXByb3h5BG5hbWUHaXNwcm94eQRib29sB3JlbnRjcHUABARmcm9tBG5hbWUIcmVjZWl2ZXIEbmFtZQxsb2FuX3BheW1lbnQFYXNzZXQJbG9hbl9mdW5kBWFzc2V0B3JlbnRuZXQABARmcm9tBG5hbWUIcmVjZWl2ZXIEbmFtZQxsb2FuX3BheW1lbnQFYXNzZXQJbG9hbl9mdW5kBWFzc2V0C3JleF9iYWxhbmNlAAYHdmVyc2lvbgV1aW50OAVvd25lcgRuYW1lCnZvdGVfc3Rha2UFYXNzZXQLcmV4X2JhbGFuY2UFYXNzZXQLbWF0dXJlZF9yZXgFaW50NjQOcmV4X21hdHVyaXRpZXMbcGFpcl90aW1lX3BvaW50X3NlY19pbnQ2NFtdCHJleF9mdW5kAAMHdmVyc2lvbgV1aW50OAVvd25lcgRuYW1lB2JhbGFuY2UFYXNzZXQIcmV4X2xvYW4ACAd2ZXJzaW9uBXVpbnQ4BGZyb20EbmFtZQhyZWNlaXZlcgRuYW1lB3BheW1lbnQFYXNzZXQHYmFsYW5jZQVhc3NldAx0b3RhbF9zdGFrZWQFYXNzZXQIbG9hbl9udW0GdWludDY0CmV4cGlyYXRpb24KdGltZV9wb2ludAlyZXhfb3JkZXIABwd2ZXJzaW9uBXVpbnQ4BW93bmVyBG5hbWUNcmV4X3JlcXVlc3RlZAVhc3NldAhwcm9jZWVkcwVhc3NldAxzdGFrZV9jaGFuZ2UFYXNzZXQKb3JkZXJfdGltZQp0aW1lX3BvaW50B2lzX29wZW4EYm9vbAhyZXhfcG9vbAAIB3ZlcnNpb24FdWludDgKdG90YWxfbGVudAVhc3NldAx0b3RhbF91bmxlbnQFYXNzZXQKdG90YWxfcmVudAVhc3NldA50b3RhbF9sZW5kYWJsZQVhc3NldAl0b3RhbF9yZXgFYXNzZXQQbmFtZWJpZF9wcm9jZWVkcwVhc3NldAhsb2FuX251bQZ1aW50NjQHcmV4ZXhlYwACBHVzZXIEbmFtZQNtYXgGdWludDE2C3JtdnByb2R1Y2VyAAEIcHJvZHVjZXIEbmFtZQdzZWxscmFtAAIHYWNjb3VudARuYW1lBWJ5dGVzBWludDY0B3NlbGxyZXgAAgRmcm9tBG5hbWUDcmV4BWFzc2V0BnNldGFiaQACB2FjY291bnQEbmFtZQNhYmkFYnl0ZXMKc2V0YWNjdGNwdQACB2FjY291bnQEbmFtZQpjcHVfd2VpZ2h0BmludDY0PwpzZXRhY2N0bmV0AAIHYWNjb3VudARuYW1lCm5ldF93ZWlnaHQGaW50NjQ/CnNldGFjY3RyYW0AAgdhY2NvdW50BG5hbWUJcmFtX2J5dGVzBmludDY0PwpzZXRhbGltaXRzAAQHYWNjb3VudARuYW1lCXJhbV9ieXRlcwVpbnQ2NApuZXRfd2VpZ2h0BWludDY0CmNwdV93ZWlnaHQFaW50NjQHc2V0Y29kZQAEB2FjY291bnQEbmFtZQZ2bXR5cGUFdWludDgJdm12ZXJzaW9uBXVpbnQ4BGNvZGUFYnl0ZXMJc2V0cGFyYW1zAAEGcGFyYW1zFWJsb2NrY2hhaW5fcGFyYW1ldGVycwdzZXRwcml2AAIHYWNjb3VudARuYW1lB2lzX3ByaXYFdWludDgGc2V0cmFtAAEMbWF4X3JhbV9zaXplBnVpbnQ2NApzZXRyYW1yYXRlAAEPYnl0ZXNfcGVyX2Jsb2NrBnVpbnQxNgZzZXRyZXgAAQdiYWxhbmNlBWFzc2V0DHVuZGVsZWdhdGVidwAEBGZyb20EbmFtZQhyZWNlaXZlcgRuYW1lFHVuc3Rha2VfbmV0X3F1YW50aXR5BWFzc2V0FHVuc3Rha2VfY3B1X3F1YW50aXR5BWFzc2V0CnVubGlua2F1dGgAAwdhY2NvdW50BG5hbWUEY29kZQRuYW1lBHR5cGUEbmFtZQl1bnJlZ3Byb2QAAQhwcm9kdWNlcgRuYW1lDHVuc3Rha2V0b3JleAAEBW93bmVyBG5hbWUIcmVjZWl2ZXIEbmFtZQhmcm9tX25ldAVhc3NldAhmcm9tX2NwdQVhc3NldAp1cGRhdGVhdXRoAAQHYWNjb3VudARuYW1lCnBlcm1pc3Npb24EbmFtZQZwYXJlbnQEbmFtZQRhdXRoCWF1dGhvcml0eQl1cGRhdGVyZXgAAQVvd25lcgRuYW1lDHVwZHRyZXZpc2lvbgABCHJldmlzaW9uBXVpbnQ4DnVzZXJfcmVzb3VyY2VzAAQFb3duZXIEbmFtZQpuZXRfd2VpZ2h0BWFzc2V0CmNwdV93ZWlnaHQFYXNzZXQJcmFtX2J5dGVzBWludDY0DHZvdGVwcm9kdWNlcgADBXZvdGVyBG5hbWUFcHJveHkEbmFtZQlwcm9kdWNlcnMGbmFtZVtdCnZvdGVyX2luZm8ACgVvd25lcgRuYW1lBXByb3h5BG5hbWUJcHJvZHVjZXJzBm5hbWVbXQZzdGFrZWQFaW50NjQQbGFzdF92b3RlX3dlaWdodAdmbG9hdDY0E3Byb3hpZWRfdm90ZV93ZWlnaHQHZmxvYXQ2NAhpc19wcm94eQRib29sBmZsYWdzMQZ1aW50MzIJcmVzZXJ2ZWQyBnVpbnQzMglyZXNlcnZlZDMFYXNzZXQLd2FpdF93ZWlnaHQAAgh3YWl0X3NlYwZ1aW50MzIGd2VpZ2h0BnVpbnQxNgh3aXRoZHJhdwACBW93bmVyBG5hbWUGYW1vdW50BWFzc2V0NQAAAEBJM5M7B2JpZG5hbWUAAABIUy91kzsJYmlkcmVmdW5kAAAAAABIc70+BmJ1eXJhbQAAsMr+SHO9PgtidXlyYW1ieXRlcwAAAAAAdHW9PgZidXlyZXgAALyJKkWFpkELY2FuY2VsZGVsYXkAgNM1XF3pTEQMY2xhaW1yZXdhcmRzAAAAAF1dhWlECGNsb3NlcmV4AHBVurSrG9FEDGNuY2xyZXhvcmRlcgAAVDbJRYonRQtjb25zb2xpZGF0ZQAAwDQ06oqWSgpkZWZjcHVsb2FuAADANDRmNZdKCmRlZm5ldGxvYW4AAAA/KhumokoKZGVsZWdhdGVidwAAQMvaqKyiSgpkZWxldGVhdXRoAAAAACA7TKtKB2RlcG9zaXQAAKahUVeUpl4LZnVuZGNwdWxvYW4AAKahMauZpl4LZnVuZG5ldGxvYW4AAAAAAACQ3XQEaW5pdAAAAAAtawOniwhsaW5rYXV0aAAAMJtuG3zXlgttdmZyc2F2aW5ncwAAMJtuG0zzlgttdnRvc2F2aW5ncwAAQJ6aImS4mgpuZXdhY2NvdW50AAAAAAAiGs+kB29uYmxvY2sAAAAA4NJ71aQHb25lcnJvcgAAAAAApKmXugZyZWZ1bmQAAK5COtFbmboLcmVncHJvZHVjZXIAAAAAvtNbmboIcmVncHJveHkAAAAAQFeUp7oHcmVudGNwdQAAAAAgq5mnugdyZW50bmV0AAAAAACprrq6B3JleGV4ZWMAAK5COtFbt7wLcm12cHJvZHVjZXIAAAAAQJobo8IHc2VsbHJhbQAAAACgqxujwgdzZWxscmV4AAAAAAC4Y7LCBnNldGFiaQAAgK4oI2SywgpzZXRhY2N0Y3B1AABAVjMjZLLCCnNldGFjY3RuZXQAAIA0NyNkssIKc2V0YWNjdHJhbQAAAM5OumiywgpzZXRhbGltaXRzAAAAAEAlirLCB3NldGNvZGUAAADA0lxTs8IJc2V0cGFyYW1zAAAAAGC7W7PCB3NldHByaXYAAAAAAEhzs8IGc2V0cmFtAACAyuZKc7PCCnNldHJhbXJhdGUAAAAAAHR1s8IGc2V0cmV4AMCPyoapqNLUDHVuZGVsZWdhdGVidwAAQMvawOni1Ap1bmxpbmthdXRoAAAASPRWpu7UCXVucmVncHJvZADQ1aVZQZPx1Ax1bnN0YWtldG9yZXgAAEDL2qhsUtUKdXBkYXRlYXV0aAAAAOjqqmxS1Ql1cGRhdGVyZXgAMKnDbqubU9UMdXBkdHJldmlzaW9uAHAV0oneqjLdDHZvdGVwcm9kdWNlcgAAAADc3NSy4wh3aXRoZHJhdwATAAAAoGHT3DEDaTY0AAAIYWJpX2hhc2gAAE5TL3WTOwNpNjQAAApiaWRfcmVmdW5kAAAAYBoadUUDaTY0AAAIcmV4X2xvYW4AAAAgTXOiSgNpNjQAABNkZWxlZ2F0ZWRfYmFuZHdpZHRoAAAAAERzaGQDaTY0AAASZW9zaW9fZ2xvYmFsX3N0YXRlAAAAQERzaGQDaTY0AAATZW9zaW9fZ2xvYmFsX3N0YXRlMgAAAGBEc2hkA2k2NAAAE2Vvc2lvX2dsb2JhbF9zdGF0ZTMAAAA4uaOkmQNpNjQAAAhuYW1lX2JpZAAAAGAaGrOaA2k2NAAACHJleF9sb2FuAADAVyGd6K0DaTY0AAANcHJvZHVjZXJfaW5mbwCAwFchneitA2k2NAAADnByb2R1Y2VyX2luZm8yAADICl4jpbkDaTY0AAAOZXhjaGFuZ2Vfc3RhdGUAAAAAp6mXugNpNjQAAA5yZWZ1bmRfcmVxdWVzdAAAAABEc7q6A2k2NAAAC3JleF9iYWxhbmNlAAAAIE29uroDaTY0AAAIcmV4X2Z1bmQAAAAgUlq7ugNpNjQAAAhyZXhfcG9vbAAAAEorbbu6A2k2NAAACXJleF9vcmRlcgAAAACrexXWA2k2NAAADnVzZXJfcmVzb3VyY2VzAAAAAOCrMt0DaTY0AAAKdm90ZXJfaW5mbwAAAAA=='
        return Promise.resolve({ abi: base64ToBinary(base64Abi), accountName })
      },
    }
    const api = new Api({
      rpc: new JsonRpc(''),
      signatureProvider: new JsSignatureProvider([]),
      abiProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    })
    return await api.deserializeTransactionWithActions(txHex)
  }
})

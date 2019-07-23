import { expect } from 'chai'
import bitcoinFactory from '../../bitcoin/bitcoin'
import { Currency } from '../../..'

describe('btc redeem script', () => {
  const test = (currency: Currency, key1: string, key2: string, key3: string, expectedResult: string) => {
    it(`should create same ${currency} script regardless of public keys order`, () => {
      const bitcoin = bitcoinFactory(Currency.BTC, 'mainnet')
      const result1 = bitcoin.createMultisigRedeemScript([key1, key2, key3])
      const result2 = bitcoin.createMultisigRedeemScript([key1, key3, key2])
      const result3 = bitcoin.createMultisigRedeemScript([key2, key1, key3])
      const result4 = bitcoin.createMultisigRedeemScript([key2, key3, key1])
      const result5 = bitcoin.createMultisigRedeemScript([key3, key1, key2])
      const result6 = bitcoin.createMultisigRedeemScript([key3, key2, key1])

      const results = Array.from(new Set([result1, result2, result3, result4, result5, result6].map(r => r.toString('hex'))))
      expect(results).to.have.lengthOf(1)
      expect(results[0]).to.eq(expectedResult)
    })
  }

  test(
    Currency.BTC,
    'xpub661MyMwAqRbcGoGUzL3c2Rh6M7g55N328aYiKQ5JcjCYhJXziwpLx1ND1iwuiMt2PCn1LvAuh7kAUXXtYA4vXvrRHt6gEcjN9zRoZujnKZ7',
    'xpub661MyMwAqRbcFcKfLPw4nGjQBHt634L7RMYV4koBC4xzy63ciW7VeK6YaWJKnyLB3ayE4r39t3V3nHdvfhJetCwZhmHafnZzZz28B2f7oBn',
    'xpub661MyMwAqRbcFxZJupmaLEWq9JQsutP9AwqNhwvp465pttGasp3ZbsERk7V9dtoswJrdNGXiJ6nSRC7q8rwq6GbTAxG65qGFqTcn8jHG6GN',
    '52210297c3939f58de0d8270099f014d794ef21d2e0993635693cedf900682a2511381210245ef28cd451b749328def58a47110a4431d2e59c9c0189851c9a9b9c1315079f2103e84eaa6d3a1da3cd027592e16c16ba8ae3884287df146da3e9dc2430199b62cb53ae',
  )

  test(
    Currency.BTG,
    'xpub6EMrrmP29cPq4B3C1AZDChwXYARUSyVoztnv2MdonFpdn8CNsEfd2HgAVhuV5YeYDkGFjo7ELoq4RtExRPaVcHYhQj9ZKs9At9NsVGfpNDh',
    'xpub6E8gfSvqDFFjaqCTTZTEMXo4wyir6ZMSao3fHU8EKfJmodquDeLpFHMVWWA6gfFerJSjJcGwPab9ybCNJZVLg4Jz7HpbnxBRAjW2qRjQRtF',
    'xpub6CArC28NGVZ8XPSx5edd25uRzEXuAfRtmWGnRFZ5awRumguY6EymLZ2mnA4Ws4GjiVHTL3Roa1Djiei1jPw1qpAjh4GGLgVXe3KF9K97qAi',
    '5221035e8f652e3d1d7a6fc205de43101bfc517762af8c039a3d8254ae77829dee55002102c067c966c0260abaf2e08a57a341a1ee5842a32bb47ea411aef69c3fed38d8f5210363b4ec96e8256a788e78689fa3dbbc77d6d2cdd25a9383876fa648b945b40c6753ae',
  )
})

import {expect} from 'chai'

import * as bitcoin from '../bitcoin'

describe('redeem script', () => {
  it('should create same script regardless of public keys order', () => {
    const key1 = 'xpub661MyMwAqRbcGoGUzL3c2Rh6M7g55N328aYiKQ5JcjCYhJXziwpLx1ND1iwuiMt2PCn1LvAuh7kAUXXtYA4vXvrRHt6gEcjN9zRoZujnKZ7'
    const key2 = 'xpub661MyMwAqRbcFcKfLPw4nGjQBHt634L7RMYV4koBC4xzy63ciW7VeK6YaWJKnyLB3ayE4r39t3V3nHdvfhJetCwZhmHafnZzZz28B2f7oBn'
    const key3 = 'xpub661MyMwAqRbcFxZJupmaLEWq9JQsutP9AwqNhwvp465pttGasp3ZbsERk7V9dtoswJrdNGXiJ6nSRC7q8rwq6GbTAxG65qGFqTcn8jHG6GN'

    const result1 = bitcoin.createMultisigRedeemScript([key1, key2, key3])
    const result2 = bitcoin.createMultisigRedeemScript([key1, key3, key2])
    const result3 = bitcoin.createMultisigRedeemScript([key2, key1, key3])
    const result4 = bitcoin.createMultisigRedeemScript([key2, key3, key1])
    const result5 = bitcoin.createMultisigRedeemScript([key3, key1, key2])
    const result6 = bitcoin.createMultisigRedeemScript([key3, key2, key1])

    const results = Array.from(new Set([result1, result2, result3, result4, result5, result6].map(r => r.toString('hex'))))
    expect(results).to.have.lengthOf(1)
    expect(results[0]).to.eq('52210297c3939f58de0d8270099f014d794ef21d2e0993635693cedf900682a2511381210245ef28cd451b749328def58a47110a4431d2e59c9c0189851c9a9b9c1315079f2103e84eaa6d3a1da3cd027592e16c16ba8ae3884287df146da3e9dc2430199b62cb53ae')
  })
})


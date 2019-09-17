import { expect } from 'chai'

import { eosKeyModuleFactory } from '../../eos/eos-key'

const keyModule = eosKeyModuleFactory()

describe('deriveKeyPair', () => {
  it('should create new keyPair with derived pubKey', () => {
    const result = keyModule.deriveKeyPair(
      {
        prvKey: 'KxFAzT7QM1ezWbu83MjTiWeRDYmRv6TEZkvZsUgtxsEY69wMcjpA',
        pubKey: 'EOS7dmmArn981QQtC4h3XrpTfepRfHw3ALmeEt58GNxjM6kueKEk8',
      },
      '1',
    )
    expect(result.prvKey).to.eq(
      '5HuYhazz1EhGNA1BnUxcxvqF2XyeB6z6tkwngQYDw1c8JzXSj2x',
    )
    expect(result.pubKey).to.eq(
      'EOS611o2E8845Qsew3xmPAnH5MCz7B3TWZaSVMD6BTsyYaobybxB8',
    )
  })
})

describe('generateNewKey', () => {
  it('should return new key', async () => {
    const result = await keyModule.generateNewKeyPair()

    expect(result.prvKey).to.have.lengthOf(51)
    expect(result.pubKey).to.have.lengthOf(53)
    expect(result.pubKey.slice(0, 3)).to.eq('EOS')
  })
})

describe('encrypt/decrypt Key', () => {
  it('should encryp/decrypt keyPair', () => {
    const keyPair = {
      prvKey: '5Jf4zZa4MAF8StLxc4VvLGHruum48pYufUbVYgZfLmWZK4nCERE',
      pubKey: 'EOS6V8g6491aR6iJqk1gNET6mscAqw3vwu36TTjPnqBKvcpguqhWa',
    }
    const encryptedResults = keyModule.encryptKeyPair(keyPair, 'pass')

    expect(JSON.parse(encryptedResults.prvKey!)).to.haveOwnProperty('cipher')

    const decryptedResults = keyModule.decryptKeyPair(encryptedResults, 'pass')
    expect(decryptedResults.prvKey).to.eq(keyPair.prvKey)
    expect(decryptedResults.pubKey).to.eq(keyPair.pubKey)
  })
})

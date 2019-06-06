import { expect } from 'chai'

import { keyModuleFactory } from '../../eos/eos-key'
import { PrivateKey } from 'eosjs-ecc';

const keyModule = keyModuleFactory()

describe('deriveKeyPair', () => {
  it('should create new keyPair with derived pubKey', () => {
    const result = keyModule.deriveKey('KxFAzT7QM1ezWbu83MjTiWeRDYmRv6TEZkvZsUgtxsEY69wMcjpA', '1')
    expect(result.toString()).to.eq('5HuYhazz1EhGNA1BnUxcxvqF2XyeB6z6tkwngQYDw1c8JzXSj2x')
    expect(result.toPublic().toString()).to.eq('EOS611o2E8845Qsew3xmPAnH5MCz7B3TWZaSVMD6BTsyYaobybxB8')
  })
})


describe('generateNewKey', () => {
  it('should return new key', async () => {
    const result = await keyModule.generateNewKey()

    expect(result.toString()).to.have.lengthOf(51)
    expect(result.toPublic().toString()).to.have.lengthOf(53)
    expect(result.toPublic().toString().slice(0, 3)).to.eq('EOS')
  })
})

describe('encrypt/decrypt Key', () => {

  it('should encryp/decrypt keyPair', () => {
    let keyAsString = '5Jf4zZa4MAF8StLxc4VvLGHruum48pYufUbVYgZfLmWZK4nCERE';
    const key = PrivateKey(keyAsString)
    const encryptedResults = keyModule.encryptKey(key, 'pass')

    expect(JSON.parse(encryptedResults)).to.haveOwnProperty('cipher')

    const decryptedResults = keyModule.decryptKey(encryptedResults, 'pass')
    expect(decryptedResults.toString()).to.eq(keyAsString)
    expect(decryptedResults.toPublic().toString()).to.eq(key.toPublic().toString())
    expect(JSON.stringify(decryptedResults)).to.eq(JSON.stringify(key))
  })
})
import * as key from '../key'
import * as addressModule from '../address'
import * as config from '../config'
import * as constants from '../constants'
import bitcoinjslib from 'bitcoinjs-lib'

beforeEach(() => {
  // @ts-ignore
  config.network = bitcoinjslib.networks.testnet
})

describe('test data', () => {
  it('should generate a set of keys', () => {
    const password = 'pinky-i-mozg-backend'

    const userKey = key.deriveKeyPair(key.generateNewKeyPair(), constants.ROOT_DERIVATION_PATH)
    const backupKey = key.deriveKeyPair(key.generateNewKeyPair(), constants.ROOT_DERIVATION_PATH)
    const serviceKey = key.deriveKeyPair(key.generateNewKeyPair(), constants.ROOT_DERIVATION_PATH)
    const encUserKey = key.encryptKeyPair(userKey, password)
    const encBackupKey = key.encryptKeyPair(backupKey, password)
    const encServiceKey = key.encryptKeyPair(serviceKey, password)

    console.log('Private key encryption password: ' + password)
    console.log('User key (public):          ' + encUserKey.pubKey)
    console.log('User key (private):         ' + userKey.prvKey)
    console.log('User key (private, enc):    ' + encUserKey.prvKey)
    console.log('Backup key (public):        ' + encBackupKey.pubKey)
    console.log('Backup key (private):       ' + backupKey.prvKey)
    console.log('Backup key (private, enc):  ' + encBackupKey.prvKey)
    console.log('Service key (public):       ' + encServiceKey.pubKey)
    console.log('Service key (private):      ' + serviceKey.prvKey)
    console.log('Service key (private, enc): ' + encServiceKey.prvKey)
    console.log('')

    const pubKeys = [encUserKey.pubKey, encBackupKey.pubKey, encServiceKey.pubKey]
    pubKeys.sort()

    console.log('Public keys, sorted lexicographically:')
    pubKeys.forEach((pk: string) => console.log(pk))
    console.log('')

    const cosignerIndex = pubKeys.indexOf(encUserKey.pubKey)
    console.log('Cosigner index: ' + cosignerIndex)
    console.log('')

    const t1 = addressModule.generateNewMultisigAddress(pubKeys, `${cosignerIndex}/0/0`)
    console.log(`Address for ${cosignerIndex}/0/0: ` + t1.address)
    const t2 = addressModule.generateNewMultisigAddress(pubKeys, `${cosignerIndex}/0/1`)
    console.log(`Address for ${cosignerIndex}/0/1: ` + t2.address)
    const t3 = addressModule.generateNewMultisigAddress(pubKeys, `${cosignerIndex}/1/0`)
    console.log(`Address for ${cosignerIndex}/1/0: ` + t3.address)
  })
})

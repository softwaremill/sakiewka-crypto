import { expect } from 'chai'
import bitcoinjsLib from 'bitcoinjs-lib'

import * as address from '../address'
import * as wallet from '../wallet'

describe('generateNewMultisigAddress', () => {
  it('should exist', () => {
    expect(address.generateNewMultisigAddress).to.be.a('function')
  })

  it('should return proper address', () => {
    const pubKeys = [
      'xpub661MyMwAqRbcEbQrpBDMTDgW5Hjg5BFxoJD2SnzTmTASPxD4i4j1xMCKojYwgaRXXBRAHB7WPECxA2aQVfL61G4mWjnHMj6BJtAQKMVAiYs',
      'xpub661MyMwAqRbcGukLdXtbs5TTqkddNUYzdWAmZ3mQTRZgtaySzU9ePfVEZWtQJBZGbfKfhPZfG74z6TXkeEx2atofMhn2n4bHLzjDWHREM5u',
      'xpub661MyMwAqRbcGQQ9zYBFdkPxFBryTQwXCEr2zKsm2YBkeDFWbkKBUAWeRUaaseSmTWaat8npZ6nfyYqe1joSH6jsQdhK4W5fia35LgZfwVF'
    ]

    const result = address.generateNewMultisigAddress(
      pubKeys,
      '0/23')

    expect(result).to.be.equal('32ora6gx1fLjdgbstMs4SdJhkC8QsMjcat')
  })
})

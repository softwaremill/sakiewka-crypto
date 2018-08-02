import { expect } from 'chai'

import * as addressModule from '../address'

describe('generateNewMultisigAddress', () => {
  it('should exist', () => {
    expect(addressModule.generateNewMultisigAddress).to.be.a('function')
  })

  it('should return proper address', () => {
    const pubKeys = [
      'xpub661MyMwAqRbcEbQrpBDMTDgW5Hjg5BFxoJD2SnzTmTASPxD4i4j1xMCKojYwgaRXXBRAHB7WPECxA2aQVfL61G4mWjnHMj6BJtAQKMVAiYs',
      'xpub661MyMwAqRbcGukLdXtbs5TTqkddNUYzdWAmZ3mQTRZgtaySzU9ePfVEZWtQJBZGbfKfhPZfG74z6TXkeEx2atofMhn2n4bHLzjDWHREM5u',
      'xpub661MyMwAqRbcGQQ9zYBFdkPxFBryTQwXCEr2zKsm2YBkeDFWbkKBUAWeRUaaseSmTWaat8npZ6nfyYqe1joSH6jsQdhK4W5fia35LgZfwVF'
    ]

    const { address } = addressModule.generateNewMultisigAddress(
      pubKeys,
      '0/23')

    expect(address).to.be.equal('32ora6gx1fLjdgbstMs4SdJhkC8QsMjcat')
  })
})

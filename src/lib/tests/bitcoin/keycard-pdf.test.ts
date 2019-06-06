import { expect, use } from 'chai'
import { generatePdf } from '../../bitcoin/bitcoin-keycard-pdf'
import chaiString from 'chai-string'
import * as fs from 'fs'

beforeEach(() => {
  use(chaiString)
})

describe('PDF Backup Sheet generator', () => {
  // This is a helper test to generate the pdf
  it.skip('should generate pdf file', async () => {
    const servicePublicKey = 'xpub661MyMwAqRbcG6wkoNfhLXdWQ8UnuB4K4mBhaT6WhW4Mnp7UCDo3CtiQWQzzXJMgPk1cjUqoff9TR9WN61tqmumzAq4DwuGx9xvuxEihXEA'
    const userPrivateKey = '{"iv":"jPBIE/1S+NGckHMXVHDgcA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"dV7sfCPyg3k=","ct":"2gJDm3OWenKfDfhVwvs3yLDk3IlwcDjUlnfdgCZ3bDs3Kv5h6BOgcEE5bLURwCQpdxJQbEj1ZdA0Ju2n7avJKJzf7OmdPPMt/P+UbQ8LlbX8tFV2Qdpj9C0rhX1JsgaG4Tyb5N+6znmRIdaVmlR8eATd0em6hIY="}'
    const backupPrivateKey = '{"iv":"jPBIE/1S+NGckHMXVHDgcA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"dV7sfCPyg3k=","ct":"2gJDm3OWenKfDfhVwvs3yLDk3IlwcDjUlnfdgCZ3bDs3Kv5h6BOgcEE5bLURwCQpdxJQbEj1ZdA0Ju2n7avJKJzf7OmdPPMt/P+UbQ8LlbX8tFV2Qdpj9C0rhX1JsgaG4Tyb5N+6znmRIdaVmlR8eATd0em6hIY="}'
    const base64 = await generatePdf('My 1st Wallet', servicePublicKey, userPrivateKey, backupPrivateKey)
    const output = new Buffer(base64, 'base64')
    fs.writeFileSync('./test-keycard.pdf', output)
  })

  // This is a helper test to generate the pdf
  it.skip('should generate pdf file with missing prv keys', async () => {
    const servicePublicKey = 'xpub661MyMwAqRbcG6wkoNfhLXdWQ8UnuB4K4mBhaT6WhW4Mnp7UCDo3CtiQWQzzXJMgPk1cjUqoff9TR9WN61tqmumzAq4DwuGx9xvuxEihXEA'
    const base64 = await generatePdf('My 1st Wallet', servicePublicKey)
    const output = new Buffer(base64, 'base64')
    fs.writeFileSync('./test-keycard-without-prvs.pdf', output)
  })

  it('should generate base64 representation of pdf', async () => {
    const servicePublicKey = 'xpub661MyMwAqRbcG6wkoNfhLXdWQ8UnuB4K4mBhaT6WhW4Mnp7UCDo3CtiQWQzzXJMgPk1cjUqoff9TR9WN61tqmumzAq4DwuGx9xvuxEihXEA'
    const userPrivateKey = '{"iv":"jPBIE/1S+NGckHMXVHDgcA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"dV7sfCPyg3k=","ct":"2gJDm3OWenKfDfhVwvs3yLDk3IlwcDjUlnfdgCZ3bDs3Kv5h6BOgcEE5bLURwCQpdxJQbEj1ZdA0Ju2n7avJKJzf7OmdPPMt/P+UbQ8LlbX8tFV2Qdpj9C0rhX1JsgaG4Tyb5N+6znmRIdaVmlR8eATd0em6hIY="}'
    const backupPrivateKey = '{"iv":"jPBIE/1S+NGckHMXVHDgcA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"dV7sfCPyg3k=","ct":"2gJDm3OWenKfDfhVwvs3yLDk3IlwcDjUlnfdgCZ3bDs3Kv5h6BOgcEE5bLURwCQpdxJQbEj1ZdA0Ju2n7avJKJzf7OmdPPMt/P+UbQ8LlbX8tFV2Qdpj9C0rhX1JsgaG4Tyb5N+6znmRIdaVmlR8eATd0em6hIY="}'
    const output = await generatePdf('My Wallet 2nd', servicePublicKey, userPrivateKey, backupPrivateKey)
    const decodedEncodedOutput = Buffer.from(Buffer.from(output, 'base64')).toString('base64')

    expect(output).to.equal(decodedEncodedOutput)
  })
})

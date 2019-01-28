import {expect} from 'chai'
import { generateBackupPdfBase64 } from '../pdfgen'
import * as fs from 'fs'

describe('PDF Backup Sheet generator', () => {
    //This is a helper test to generate a file with the pdf
    xit('should generate pdf file', async () => {
        const userPrivateKey = '{"iv":"jPBIE/1S+NGckHMXVHDgcA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"dV7sfCPyg3k=","ct":"2gJDm3OWenKfDfhVwvs3yLDk3IlwcDjUlnfdgCZ3bDs3Kv5h6BOgcEE5bLURwCQpdxJQbEj1ZdA0Ju2n7avJKJzf7OmdPPMt/P+UbQ8LlbX8tFV2Qdpj9C0rhX1JsgaG4Tyb5N+6znmRIdaVmlR8eATd0em6hIY="}'
        const backupPrivateKey = '{"iv":"jPBIE/1S+NGckHMXVHDgcA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"dV7sfCPyg3k=","ct":"2gJDm3OWenKfDfhVwvs3yLDk3IlwcDjUlnfdgCZ3bDs3Kv5h6BOgcEE5bLURwCQpdxJQbEj1ZdA0Ju2n7avJKJzf7OmdPPMt/P+UbQ8LlbX8tFV2Qdpj9C0rhX1JsgaG4Tyb5N+6znmRIdaVmlR8eATd0em6hIY="}'
        const servicePublicKey = 'xpub661MyMwAqRbcG6wkoNfhLXdWQ8UnuB4K4mBhaT6WhW4Mnp7UCDo3CtiQWQzzXJMgPk1cjUqoff9TR9WN61tqmumzAq4DwuGx9xvuxEihXEA'
        const encryptedPassword = '{"iv":"EVleTSjy2pGoU6q6+z7GJg==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"Ih4pF9Xq+kY=","ct":"JUsn+2+5vogUfCWx0cJXZ21/99+vgAOeY/LEg0jC+vaHmHvq/K4bdYfy"}'
        const base64 = await generateBackupPdfBase64(userPrivateKey, backupPrivateKey, servicePublicKey, encryptedPassword)
        const output = new Buffer(base64, 'base64')
        fs.writeFileSync("/home/pb/Devel/sakiewka/testb64.pdf", output)
    })

    it('should generate base64 representation of pdf', async () => {
        const userPrivateKey = '{"iv":"jPBIE/1S+NGckHMXVHDgcA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"dV7sfCPyg3k=","ct":"2gJDm3OWenKfDfhVwvs3yLDk3IlwcDjUlnfdgCZ3bDs3Kv5h6BOgcEE5bLURwCQpdxJQbEj1ZdA0Ju2n7avJKJzf7OmdPPMt/P+UbQ8LlbX8tFV2Qdpj9C0rhX1JsgaG4Tyb5N+6znmRIdaVmlR8eATd0em6hIY="}'
        const backupPrivateKey = '{"iv":"jPBIE/1S+NGckHMXVHDgcA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"dV7sfCPyg3k=","ct":"2gJDm3OWenKfDfhVwvs3yLDk3IlwcDjUlnfdgCZ3bDs3Kv5h6BOgcEE5bLURwCQpdxJQbEj1ZdA0Ju2n7avJKJzf7OmdPPMt/P+UbQ8LlbX8tFV2Qdpj9C0rhX1JsgaG4Tyb5N+6znmRIdaVmlR8eATd0em6hIY="}'
        const servicePublicKey = 'xpub661MyMwAqRbcG6wkoNfhLXdWQ8UnuB4K4mBhaT6WhW4Mnp7UCDo3CtiQWQzzXJMgPk1cjUqoff9TR9WN61tqmumzAq4DwuGx9xvuxEihXEA'
        const encryptedPassword = '{"iv":"EVleTSjy2pGoU6q6+z7GJg==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"Ih4pF9Xq+kY=","ct":"JUsn+2+5vogUfCWx0cJXZ21/99+vgAOeY/LEg0jC+vaHmHvq/K4bdYfy"}'
        const output = await generateBackupPdfBase64(userPrivateKey, backupPrivateKey, servicePublicKey, encryptedPassword)
        expect(output).to.equal('generated base64 representation is different each time, probably due to some date changes, need to investigate')
    })
})

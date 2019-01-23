import {generateBackupPdf} from '../pdfgen'
import * as fs from 'fs'

describe('test', () => {
    it('should generate pdf file', async () => {
        const doc = generateBackupPdf()
        doc.pipe(fs.createWriteStream("/home/pb/Devel/sakiewka/test.pdf"))
    })
})
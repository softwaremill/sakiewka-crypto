import PDFDocument from 'pdfkit'
import {Base64Encode} from 'base64-stream'

const QR_DATA_GAP = 15
const QR_WIDTH = 128
const QR_HEIGHT = 128

export const generateBackupPdfBase64 = (userPrivateKey: string, backupPrivateKey: string, servicePublicKey: string, encryptedPassword: string): Promise<string> => {
  const doc = generateBackupPdf(userPrivateKey, backupPrivateKey, servicePublicKey, encryptedPassword)
  const stream = doc.pipe(new Base64Encode())
  var base64Pdf = ''
  stream.on('data', (data:string) => base64Pdf += data)
  return new Promise((resolve, reject) => {
    stream.on('end', () => resolve(base64Pdf))
    stream.on('error', () => reject())
  })
}

const generateBackupPdf = (userPrivateKey: string, backupPrivateKey: string, servicePublicKey: string, encryptedPassword: string): PDFKit.PDFDocument => {
    const doc = new PDFDocument();
    const start = 130

    printFlash(doc, 'Print this page or keep it securely offline!', 0, 0)

    drawDataBox(doc, {
      header: 'A: User key',
      description: 'This is your password-encrypted private key',
      data: userPrivateKey,
      x: doc.page.margins.left,
      y: start
    })

    drawDataBox(doc, {
      header: 'B: Backup key',
      description: 'This is your password-encrypted backup private key',
      data: backupPrivateKey,
      x: doc.page.margins.left,
      y: start * 2 + 20
    })

    drawDataBox(doc, {
      header: 'C: Service public key',
      description: 'This is the public part of the key the service will use to co-sign transactions with you on Your wallet',
      data: servicePublicKey,
      x: doc.page.margins.left,
      y: start * 3 + 40
    })

    drawDataBox(doc, {
      header: 'D: Encrypted wallet password',
      description: 'This is your password-encrypted private key',
      data: encryptedPassword,
      x: doc.page.margins.left,
      y: start * 4 + 60
    })
    
    doc.end()
    return doc
}

const printFlash = (doc: PDFKit.PDFDocument, message: string, x: number, y: number) => {
  doc.save()
  doc.rect(doc.page.margins.left, doc.page.margins.top, doc.page.width - doc.page.margins.right - doc.page.margins.left, 20)

  doc.fillAndStroke("#faa", "#f55")
  doc.restore()
  doc.fontSize(10).fill("#000").text(message, doc.page.margins.left, doc.page.margins.top + 6, {align: 'center'}) // x has to be specified, otherwise align option is not used
}

const drawDataBox = (doc: PDFKit.PDFDocument, data: DataBoxConfig): PDFKit.PDFDocument => {
  doc.save()
  doc.rect(data.x, data.y, QR_WIDTH, QR_HEIGHT)
  doc.stroke()
  doc.restore()
  doc.fontSize(14).text(data.header, data.x + QR_WIDTH + QR_DATA_GAP, data.y)
  doc.fontSize(10).fill("#999").text(data.description)
  doc.moveDown()
  doc.fontSize(10).fill("#000").text(data.data)
  return doc
}

interface DataBoxConfig {
  header: string
  description: string
  data: string
  x: number
  y: number
}

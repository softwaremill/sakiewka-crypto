import PDFDocument from 'pdfkit'
import { Base64Encode } from 'base64-stream'
import * as QRCode from 'qrcode'

const QR_DATA_GAP = 15
const QR_WIDTH = 128

export const generateBackupPdfBase64 = async (userPrivateKey: string, backupPrivateKey: string, servicePublicKey: string, encryptedPassword: string): Promise<string> => {
  const doc = await generateBackupPdf(userPrivateKey, backupPrivateKey, servicePublicKey, encryptedPassword)
  const stream = doc.pipe(new Base64Encode())
  let base64Pdf: string = ''
  stream.on('data', (data: string) => base64Pdf += data)
  return new Promise<string>((resolve: Function, reject: Function) => {
    stream.on('end', () => resolve(base64Pdf))
    stream.on('error', () => reject())
  })
}

const generateBackupPdf = async (userPrivateKey: string, backupPrivateKey: string, servicePublicKey: string, encryptedPassword: string): Promise<PDFKit.PDFDocument> => {
  const doc = new PDFDocument()
  const date = new Date()
  const start = 140
  const imageHeight = 50
  const qrOffset = 40

  doc.image(
    '/Users/darek/bitbay/sakiewka-crypto/src/lib/resources/bitbay-rgb.png',
    doc.page.margins.left,
    (doc.page.margins.top + imageHeight) / 2,
    { height: imageHeight }
  )
    .fontSize(24)
    .text('Key Card', doc.page.width / 2, doc.page.margins.top, { align: 'right' })

  doc.fontSize(10).fill('#7a7a7a')
    .text(`Generated at ${date.toDateString()} for Wallet named: `, doc.page.margins.left, doc.page.margins.top + 40, { lineBreak: false })
    .font('Helvetica-Bold')
    .text('My Wallet 123')
    .font('Helvetica')

  printFlash(doc, 'Print this page or keep it securely offline. See second page for FAQ', 0, 65)

  await drawDataBox(doc, {
    header: 'A: User Key',
    description: 'This is your password-encrypted private key',
    data: userPrivateKey,
    x: doc.page.margins.left,
    y: start + qrOffset
  })

  await drawDataBox(doc, {
    header: 'B: Backup Key',
    description: 'This is your password-encrypted backup private key',
    data: backupPrivateKey,
    x: doc.page.margins.left,
    y: start * 2 + 20 + qrOffset
  })

  await drawDataBox(doc, {
    header: 'C: Service Public Key',
    description: 'This is the public part of the key the service will use to co-sign transactions with you on Your wallet',
    data: servicePublicKey,
    x: doc.page.margins.left,
    y: start * 3 + 40 + qrOffset
  })

  // await drawDataBox(doc, {
  //   header: 'D: Encrypted wallet password',
  //   description: 'This is your password-encrypted private key',
  //   data: encryptedPassword,
  //   x: doc.page.margins.left,
  //   y: start * 4 + 60
  // })

  doc.addPage()
  addTitle(doc, 'KeyCard FAQ')
  addParagraph(
    doc,
    'What is the Key Card?',
    'The KeyCard contains important information which can be used to recover the Bitcoin ' +
    'from your Wallet in several situations. Each BitGo Wallet has its own, unique KeyCard. ' +
    'If you have created multiple Wallets, you should retain the KeyCard for each of them.'
  )

  addParagraph(
    doc,
    'What should I do with it?',
    'You should print the KeyCard and/or save the PDF to an offline storage device. ' +
    'The print-out or USB stick should be kept in a safe place, such as a bank vault or home safe. ' +
    'It\'s a good idea to keep a second copy in a different location.',
    'Important: If you haven\'t provided an external backup key, then the original PDF should be deleted ' +
    'from any machine where the Wallet will be regularly accessed to prevent malware from capturing both ' +
    'the KeyCard and your Wallet passcode.'
  )

  addParagraph(
    doc,
    'What should I do if I lose it?',
    'If you have lost or damaged all copies of your KeyCard, your Bitcoin is still safe, but this Wallet ' +
    'should be considered at risk for loss. As soon as is convenient, you should use BitGo to empty the ' +
    'Wallet into a new Wallet, and discontinue use of the old Wallet.'
  )

  addParagraph(
    doc,
    'What if someone sees my KeyCard?',
    'Don\'t panic! All sensitive information on the KeyCard is encrypted with your passcode, or with a key ' +
    'which only BitGo has. But, in general, you should make best efforts to keep your KeyCard private. ' +
    'If your KeyCard does get exposed or copied in a way that makes you uncomfortable, the best course of action ' +
    'is to empty the corresponding Wallet into another Wallet and discontinue use of the old Wallet.'
  )

  addParagraph(
    doc,
    'What if I forget or lose my Wallet password?',
    'BitGo can use the information in QR Code D to help you recover access to your Wallet. Without the KeyCard, ' +
    'BitGo is not able to recover funds from a Wallet with a lost password.'
  )

  addParagraph(
    doc,
    'What if BitGo becomes inaccessible for an extended period?',
    'Your KeyCard and Wallet passcode can be used together with BitGo’s published open source tools at ' +
    'https://github.com/bitgo to recover your Bitcoin. Note: You should never enter information from your ' +
    'KeyCard into tools other than the tools BitGo has published, or your funds may be at risk for theft.'
  )

  addParagraph(
    doc,
    'Should I write my Wallet password on my KeyCard?',
    'No! BitGo’s multi-signature approach to security depends on there not being a single point ' +
    'of attack. But if your Wallet password is on your KeyCard, then anyone who gains access to your ' +
    'KeyCard will be able to steal your Bitcoin. We recommend keeping your Wallet password safe ' +
    'in a secure password manager such as LastPass, 1Password or KeePass.'
  )

  doc.end()
  return doc
}

const addTitle = (doc: PDFKit.PDFDocument, title: string) => {
  doc.fontSize(20).text(title)
}

const addParagraph = (doc: PDFKit.PDFDocument, title: string, ...contents: string[]) => {
  doc.fontSize(12)
    .moveDown()
    .fill('#000')
    .text(title)
    .fontSize(10)
    .fill('#3a3a3a')

  contents.forEach((content: string) => {
    doc.text(content).moveDown()
  })
}

const printFlash = (doc: PDFKit.PDFDocument, message: string, x: number, y: number) => {
  doc.save()
  doc.rect(doc.page.margins.left + x, doc.page.margins.top + y, doc.page.width - doc.page.margins.right - doc.page.margins.left, 25)

  // doc.fillAndStroke('#faa', '#f55')
  doc.fill('#ffe4dd')
  doc.restore()
  doc.fontSize(10).fill('#ff1c23').text(message, doc.page.margins.left + x, doc.page.margins.top + 8 + y, { align: 'center' }) // x has to be specified, otherwise align option is not used
    .fill('#000')
}

const drawDataBox = async (doc: PDFKit.PDFDocument, data: DataBoxConfig): Promise<PDFKit.PDFDocument> => {
  doc.save()
  const qrcode = await QRCode.toDataURL(data.data, { margin: 0, width: QR_WIDTH })
  const buffer = Buffer.from(qrcode.replace('data:image/png;base64,', ''), 'base64')
  doc.image(buffer, data.x, data.y)
  doc.stroke()
  doc.restore()
  doc.fontSize(14).text(data.header, data.x + QR_WIDTH + QR_DATA_GAP, data.y)
  doc.fontSize(10).fill('#999').text(data.description)
  doc.moveDown()
  doc.fontSize(10).fill('#000').text(data.data)
  return doc
}

interface DataBoxConfig {
  header: string
  description: string
  data: string
  x: number
  y: number
}

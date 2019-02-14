import PDFDocument from 'pdfkit'
import { Base64Encode } from 'base64-stream'
import * as QRCode from 'qrcode'

const QR_DATA_GAP = 15
const QR_WIDTH = 128

const colors = {
  REGULAR_COLOR: '#000',
  TEXT_COLOR: '#3a3a3a',
  INFO_COLOR: '#7a7a7a',
  WARN_BG_COLOR: '#ffe4dd',
  WARN_TEXT_COLOR: '#ff1c23'
}

const fonts = {
  MONOSPACE_FONT: 'Monospace Font',
  REGULAR_FONT: 'Regular Font',
  STRONG_FONT: 'Strong Font'
}

const fontSizes = {
  DOCUMENT_TITLE: 24,
  HEADER_1: 20,
  HEADER_3: 14,
  HEADER_4: 12,
  REGULAR: 10,
  SMALL: 8
}

export const generateBackupPdfBase64 = async (walletName: string, userPrivateKey: string, backupPrivateKey: string, servicePublicKey: string, encryptedPassword: string): Promise<string> => {
  const doc = await generateBackupPdf(walletName, userPrivateKey, backupPrivateKey, servicePublicKey, encryptedPassword)
  const stream = doc.pipe(new Base64Encode())
  let base64Pdf: string = ''
  stream.on('data', (data: string) => base64Pdf += data)
  return new Promise<string>((resolve: Function, reject: Function) => {
    stream.on('end', () => resolve(base64Pdf))
    stream.on('error', () => reject())
  })
}

const generateBackupPdf = async (walletName: string, userPrivateKey: string, backupPrivateKey: string, servicePublicKey: string, encryptedPassword: string): Promise<PDFKit.PDFDocument> => {
  const doc = new PDFDocument()
  doc.registerFont(fonts.MONOSPACE_FONT, 'Courier')
  doc.registerFont(fonts.REGULAR_FONT, 'Helvetica')
  doc.registerFont(fonts.STRONG_FONT, 'Helvetica-Bold')
  const start = 140
  const imageHeight = 50
  const qrOffset = 50

  addLogo(doc, './resources/bitbay-rgb.png', imageHeight)
  addGeneratedAt(doc, walletName)
  printFlash(doc, 'Print this page or keep it securely offline. See second page for FAQ', 0, 70)

  await drawDataBox(doc, {
    header: 'A: User Key',
    description: 'This is your password-encrypted private key',
    data: userPrivateKey,
    x: doc.page.margins.left,
    y: (start + qrOffset)
  })

  await drawDataBox(doc, {
    header: 'B: Backup Key',
    description: 'This is your password-encrypted backup private key',
    data: backupPrivateKey,
    x: doc.page.margins.left,
    y: 2 * (start + qrOffset)
  })

  await drawDataBox(doc, {
    header: 'C: Service Public Key',
    description: 'This is the public part of the key the service will use to co-sign transactions with you on Your wallet',
    data: servicePublicKey,
    x: doc.page.margins.left,
    y: 3 * (start + qrOffset)
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
    'from your Wallet in several situations. Each BitBay Wallet has its own, unique KeyCard. ' +
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
    'should be considered at risk for loss. As soon as is convenient, you should use BitBay to empty the ' +
    'Wallet into a new Wallet, and discontinue use of the old Wallet.'
  )

  addParagraph(
    doc,
    'What if someone sees my KeyCard?',
    'Don\'t panic! All sensitive information on the KeyCard is encrypted with your passcode, or with a key ' +
    'which only BitBay has. But, in general, you should make best efforts to keep your KeyCard private. ' +
    'If your KeyCard does get exposed or copied in a way that makes you uncomfortable, the best course of action ' +
    'is to empty the corresponding Wallet into another Wallet and discontinue use of the old Wallet.'
  )

  addParagraph(
    doc,
    'What if I forget or lose my Wallet password?',
    'BitBay can use the information in QR Code D to help you recover access to your Wallet. Without the KeyCard, ' +
    'BitBay is not able to recover funds from a Wallet with a lost password.'
  )

  addParagraph(
    doc,
    'What if BitBay becomes inaccessible for an extended period?',
    'Your KeyCard and Wallet passcode can be used together with BitBay’s published open source tools at ' +
    'https://github.com/bitbay to recover your Bitcoin. Note: You should never enter information from your ' +
    'KeyCard into tools other than the tools BitBay has published, or your funds may be at risk for theft.'
  )

  addParagraph(
    doc,
    'Should I write my Wallet password on my KeyCard?',
    'No! BitBay’s multi-signature approach to security depends on there not being a single point ' +
    'of attack. But if your Wallet password is on your KeyCard, then anyone who gains access to your ' +
    'KeyCard will be able to steal your Bitcoin. We recommend keeping your Wallet password safe ' +
    'in a secure password manager such as LastPass, 1Password or KeePass.'
  )

  doc.end()
  return doc
}

const addLogo = (doc: PDFKit.PDFDocument, src: string, imageHeight: number) => {
  const path = `${__dirname}/${src}`
  doc.image(path, doc.page.margins.left, (doc.page.margins.top + imageHeight) / 2, { height: imageHeight })
    .fontSize(fontSizes.DOCUMENT_TITLE)
    .text('Key Card', { align: 'right' })
}

const addGeneratedAt = (doc: PDFKit.PDFDocument, walletName: string) => {
  const date = new Date()
  doc.fontSize(fontSizes.REGULAR)
    .fill(colors.INFO_COLOR)
    .text(`Generated at ${date.toDateString()} for Wallet named: `, doc.page.margins.left, doc.page.margins.top + 45, { lineBreak: false })
    .font(fonts.STRONG_FONT)
    .text(walletName)
    .font(fonts.REGULAR_FONT)
}

const addTitle = (doc: PDFKit.PDFDocument, title: string) => {
  doc.fontSize(fontSizes.HEADER_1).text(title)
}

const addParagraph = (doc: PDFKit.PDFDocument, title: string, ...contents: string[]) => {
  doc.fontSize(fontSizes.HEADER_4)
    .moveDown()
    .fill(colors.REGULAR_COLOR)
    .text(title)
    .fontSize(fontSizes.REGULAR)
    .fill(colors.TEXT_COLOR)

  contents.forEach((content: string) => {
    doc.text(content).moveDown()
  })
}

const printFlash = (doc: PDFKit.PDFDocument, message: string, x: number, y: number) => {
  doc.save()
  doc.rect(doc.page.margins.left + x, doc.page.margins.top + y, doc.page.width - doc.page.margins.right - doc.page.margins.left, 25)

  doc.fill(colors.WARN_BG_COLOR)
  doc.restore()
  doc.fontSize(fontSizes.REGULAR)
    .fill(colors.WARN_TEXT_COLOR)
    .text(message, doc.page.margins.left + x, doc.page.margins.top + 8 + y, { align: 'center' })
    .fill(colors.REGULAR_COLOR)
}

const drawDataBox = async (doc: PDFKit.PDFDocument, data: DataBoxConfig): Promise<PDFKit.PDFDocument> => {
  doc.save()
  const qrcode = await QRCode.toDataURL(data.data, { margin: 0, width: QR_WIDTH })
  const buffer = Buffer.from(qrcode.replace('data:image/png;base64,', ''), 'base64')
  doc.image(buffer, data.x, data.y)
  doc.stroke()
  doc.restore()
  doc.fontSize(fontSizes.HEADER_3)
    .text(data.header, data.x + QR_WIDTH + QR_DATA_GAP, data.y)
  doc.fontSize(fontSizes.REGULAR)
    .fill(colors.INFO_COLOR)
    .text(data.description)
  doc.moveDown()
  doc.fontSize(fontSizes.SMALL)
    .font(fonts.MONOSPACE_FONT)
    .fill(colors.REGULAR_COLOR)
    .text(data.data)
    .font(fonts.REGULAR_FONT)
  return doc
}

interface DataBoxConfig {
  header: string
  description: string
  data: string
  x: number
  y: number
}

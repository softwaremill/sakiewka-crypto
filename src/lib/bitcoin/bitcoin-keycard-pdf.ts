import PDFDocument from 'pdfkit'
import { Base64Encode } from 'base64-stream'
import * as QRCode from 'qrcode'

const QR_DATA_GAP = 15
const QR_WIDTH = 128
const LOGO_BASE64_DEFAULT =
  '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'

const colors = {
  REGULAR_COLOR: '#000',
  TEXT_COLOR: '#3a3a3a',
  INFO_COLOR: '#7a7a7a',
  WARN_BG_COLOR: '#ffe4dd',
  WARN_TEXT_COLOR: '#ff1c23',
}

const fonts = {
  MONOSPACE_FONT: 'Monospace Font',
  REGULAR_FONT: 'Regular Font',
  STRONG_FONT: 'Strong Font',
}

const fontSizes = {
  DOCUMENT_TITLE: 24,
  HEADER_1: 20,
  HEADER_3: 14,
  HEADER_4: 12,
  REGULAR: 10,
  SMALL: 8,
}

export const generatePdf = async (
  walletName: string,
  servicePublicKey: string,
  userPrivateKey?: string,
  backupPrivateKey?: string,
  logoBase64?: string,
): Promise<string> => {
  const doc = await generateBackupPdf(
    walletName,
    servicePublicKey,
    userPrivateKey,
    backupPrivateKey,
    logoBase64,
  )
  const stream = doc.pipe(new Base64Encode())
  let base64Pdf: string = ''
  stream.on('data', (data: string) => (base64Pdf += data))
  return new Promise<string>((resolve: Function, reject: Function) => {
    stream.on('end', () => resolve(base64Pdf))
    stream.on('error', () => reject())
  })
}

function* qrOffsetGenerator(
  spacing: number,
  offset: number,
): IterableIterator<number> {
  let count: number = 0
  while (true) {
    yield spacing * count + offset
    count = count + 1
  }
}

const generateBackupPdf = async (
  walletName: string,
  servicePublicKey: string,
  userPrivateKey?: string,
  backupPrivateKey?: string,
  logoBase64?: string,
): Promise<PDFKit.PDFDocument> => {
  const doc = new PDFDocument()
  doc.registerFont(fonts.MONOSPACE_FONT, 'Courier')
  doc.registerFont(fonts.REGULAR_FONT, 'Helvetica')
  doc.registerFont(fonts.STRONG_FONT, 'Helvetica-Bold')
  const imageHeight = 15
  const imageOffset = qrOffsetGenerator(190, 190)

  addLogo(doc, logoBase64 || LOGO_BASE64_DEFAULT, imageHeight, walletName)

  if (userPrivateKey) {
    await drawDataBox(doc, {
      header: `User Key - '${walletName}'`,
      data: userPrivateKey,
      x: doc.page.margins.left,
      y: imageOffset.next().value,
    })
  }

  if (backupPrivateKey) {
    await drawDataBox(doc, {
      header: `Backup Key - '${walletName}'`,
      data: backupPrivateKey,
      x: doc.page.margins.left,
      y: imageOffset.next().value,
    })
  }

  await drawDataBox(doc, {
    header: `Service Public Key - '${walletName}'`,
    data: servicePublicKey,
    x: doc.page.margins.left,
    y: imageOffset.next().value,
  })

  // await drawDataBox(doc, {
  //   header: 'D: Encrypted wallet password',
  //   description: 'This is your password-encrypted private key',
  //   data: encryptedPassword,
  //   x: doc.page.margins.left,
  //   y: start * 4 + 60
  // })

  doc.addPage()
  addParagraph(
    doc,
    'What is the Key Card?',
    'The KeyCard contains important information which can be used to recover the Bitcoin ' +
      'from your Wallet in several situations. Each SoftwareMill Wallet has its own, unique KeyCard. ' +
      'If you have created multiple Wallets, you should retain the KeyCard for each of them.',
  )

  addParagraph(
    doc,
    'What are "User", "Backup" and "Service Public" keys?',
    'User key is your password-encrypted private key. ' +
      'Backup key is your password-encrypted backup private key. ' +
      'Service Public key is the public part of the key the service will use to co-sign transactions with you on Your wallet',
  )

  addParagraph(
    doc,
    'What should I do with it?',
    'You should print the KeyCard and/or save the PDF to an offline storage device. ' +
      'The print-out or USB stick should be kept in a safe place, such as a bank vault or home safe. ' +
      "It's a good idea to keep a second copy in a different location.",
    "Important: If you haven't provided an external backup key, then the original PDF should be deleted " +
      'from any machine where the Wallet will be regularly accessed to prevent malware from capturing both ' +
      'the KeyCard and your Wallet passcode.',
  )

  addParagraph(
    doc,
    'What should I do if I lose it?',
    'If you have lost or damaged all copies of your KeyCard, your Bitcoin is still safe, but this Wallet ' +
      'should be considered at risk for loss. As soon as is convenient, you should use SoftwareMill to empty the ' +
      'Wallet into a new Wallet, and discontinue use of the old Wallet.',
  )

  addParagraph(
    doc,
    'What if someone sees my KeyCard?',
    "Don't panic! All sensitive information on the KeyCard is encrypted with your passcode, or with a key " +
      'which only SoftwareMill has. But, in general, you should make best efforts to keep your KeyCard private. ' +
      'If your KeyCard does get exposed or copied in a way that makes you uncomfortable, the best course of action ' +
      'is to empty the corresponding Wallet into another Wallet and discontinue use of the old Wallet.',
  )

  addParagraph(
    doc,
    'What if I forget or lose my Wallet password?',
    'SoftwareMill can use the information in QR Code D to help you recover access to your Wallet. Without the KeyCard, ' +
      'SoftwareMill is not able to recover funds from a Wallet with a lost password.',
  )

  addParagraph(
    doc,
    'What if SoftwareMill becomes inaccessible for an extended period?',
    'Your KeyCard and Wallet passcode can be used together with SoftwareMill’s published open source tools at ' +
      'https://github.com/softwaremill to recover your Bitcoin. Note: You should never enter information from your ' +
      'KeyCard into tools other than the tools SoftwareMill has published, or your funds may be at risk for theft.',
  )

  addParagraph(
    doc,
    'Should I write my Wallet password on my KeyCard?',
    'No! SoftwareMill’s multi-signature approach to security depends on there not being a single point ' +
      'of attack. But if your Wallet password is on your KeyCard, then anyone who gains access to your ' +
      'KeyCard will be able to steal your Bitcoin. We recommend keeping your Wallet password safe ' +
      'in a secure password manager such as LastPass, 1Password or KeePass.',
  )

  doc.end()
  return doc
}

const addLogo = (
  doc: PDFKit.PDFDocument,
  base64Image: string,
  imageHeight: number,
  walletName: string,
) => {
  const image = new Buffer(base64Image, 'base64')
  doc
    .image(
      image,
      doc.page.margins.left,
      doc.page.margins.top + imageHeight / 2,
      { height: imageHeight },
    )
    .fontSize(fontSizes.DOCUMENT_TITLE)
    .text('Sakiewka Key Card', { align: 'right' })
}

const addParagraph = (
  doc: PDFKit.PDFDocument,
  title: string,
  ...contents: string[],
) => {
  doc
    .fontSize(fontSizes.HEADER_4)
    .fill(colors.REGULAR_COLOR)
    .text(title)
    .fontSize(fontSizes.REGULAR)
    .fill(colors.TEXT_COLOR)

  contents.forEach((content: string) => {
    doc.text(content).moveDown()
  })
}

const drawDataBox = async (
  doc: PDFKit.PDFDocument,
  data: DataBoxConfig,
): Promise<PDFKit.PDFDocument> => {
  doc.save()
  doc
    .fontSize(fontSizes.HEADER_3)
    .fill(colors.REGULAR_COLOR)
    .text(data.header, data.x, data.y - 22)
  const qrcode = await QRCode.toDataURL(data.data, {
    margin: 0,
    width: QR_WIDTH,
  })
  const buffer = Buffer.from(
    qrcode.replace('data:image/png;base64,', ''),
    'base64',
  )
  doc.image(buffer, data.x, data.y)
  doc.stroke()
  doc.restore()
  doc.fontSize(fontSizes.HEADER_3)
  doc
    .rect(
      doc.page.margins.left - 15,
      data.y - 35,
      25 + doc.page.width - 2 * doc.page.margins.left,
      180,
    )
    .stroke()
  doc
    .fontSize(fontSizes.REGULAR)
    .font(fonts.MONOSPACE_FONT)
    .fill(colors.REGULAR_COLOR)
    .text(data.data, data.x + QR_WIDTH + QR_DATA_GAP, data.y)
    .font(fonts.REGULAR_FONT)

  const date = new Date()
  doc
    .fontSize(fontSizes.REGULAR)
    .fill(colors.INFO_COLOR)
    .text(`Created at ${date.toDateString()}`, data.x + 200, data.y + 120)
  return doc
}

interface DataBoxConfig {
  header: string
  data: string
  x: number
  y: number
}

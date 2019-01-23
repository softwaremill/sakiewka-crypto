import PDFDocument from 'pdfkit'

const QR_DATA_GAP = 15
const QR_WIDTH = 128
const QR_HEIGHT = 128

export const generateBackupPdf = (): PDFKit.PDFDocument => {
    const doc = new PDFDocument();
    const userPrivateKey = '{"iv":"jPBIE/1S+NGckHMXVHDgcA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"dV7sfCPyg3k=","ct":"2gJDm3OWenKfDfhVwvs3yLDk3IlwcDjUlnfdgCZ3bDs3Kv5h6BOgcEE5bLURwCQpdxJQbEj1ZdA0Ju2n7avJKJzf7OmdPPMt/P+UbQ8LlbX8tFV2Qdpj9C0rhX1JsgaG4Tyb5N+6znmRIdaVmlR8eATd0em6hIY="}'
    const start = 150
    drawDataBox(doc, {
      header: 'A: User pkey',
      description: 'This is your password-encrypted private key',
      data: userPrivateKey,
      x: doc.page.margins.left,
      y: start
    })

    drawDataBox(doc, {
      header: 'B: Backup key',
      description: 'This is your password-encrypted backup private key',
      data: userPrivateKey,
      x: doc.page.margins.left,
      y: start * 2
    })

    drawDataBox(doc, {
      header: 'C: Service public key',
      description: 'This is the public part of the key the service will use to co-sign transactions with you on Your wallet',
      data: userPrivateKey,
      x: doc.page.margins.left,
      y: start * 3
    })

    drawDataBox(doc, {
      header: 'D: Encrypted wallet password',
      description: 'This is your password-encrypted private key',
      data: userPrivateKey,
      x: doc.page.margins.left,
      y: start * 4
    })
    doc.end()
    return doc
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
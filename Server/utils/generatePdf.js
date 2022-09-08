import PDFDocument from 'pdfkit';

export function buildPDF(data, dataCallback, endCallback) {
  const doc = new PDFDocument();
  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  doc
    .image('imgs/logo.jpeg', 250, 15, {
      fit: [100, 100],
      align: 'center',
      valign: 'center',
    })
    .text('\n\n\n\n');
  for (let i = 0; i < data.length; i++) {
    let txt = `Lock id: ${data[i].lockId} \nUser id: ${data[i].userId}\nAction: ${data[i].action}\nDetails : ${data[i].detail}\nDate: ${data[i].createdAt}\n\n`;
    doc.fontSize(12).text(txt);
  }
  doc.end();
}

export function buildLockPDF(data, dataCallback, endCallback) {
  const doc = new PDFDocument();
  doc.on('data', dataCallback);
  doc.on('end', endCallback);
  doc
    .image('imgs/logo.jpeg', 250, 15, {
      fit: [100, 100],
      align: 'center',
      valign: 'center',
    })
    .text('\n\n\n\n');
  for (let i = 0; i < data.length; i++) {
    let txt = `Owner: ${data[i].userId} \nLock id: ${data[i]._id}\nLock name: ${data[i].lockName}\nMAC : ${data[i].lockMac}\nAccess: ${data[i].access}\nCreated at: ${data[i].createdAt}\nUpdated at: ${data[i].updatedAt}\n\n`;
    doc.fontSize(12).text(txt);
  }
  doc.end();
}

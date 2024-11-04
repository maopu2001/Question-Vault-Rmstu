import jsPDF from 'jspdf';

export default async function imageUrlToBundlePdf(questions, name) {
  let doc = new jsPDF();
  const namePart = name.split(' - ');
  doc.setFontSize(32);
  doc.text(namePart[0], doc.internal.pageSize.width / 2, 40, { align: 'center' });
  doc.setFontSize(24);
  doc.text(namePart[1], doc.internal.pageSize.width / 2, 60, { align: 'center' });
  doc.text(namePart[2], doc.internal.pageSize.width / 2, 75, { align: 'center' });

  const { mid1, mid2, final } = questions;

  doc.setFontSize(36);
  doc.setFont(undefined, 'bold');

  if (mid1 && mid1.length > 0) {
    doc.text('Midterm 1', doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, { align: 'center' });
    imageUrlToPdf(doc, mid1);
  }
  if (mid2 && mid2.length > 0) {
    doc.addPage('A4', 'p');
    doc.text('Midterm 2', doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, { align: 'center' });
    imageUrlToPdf(doc, mid2);
  }

  if (final && final.length > 0) {
    doc.addPage('A4', 'p');
    doc.setFontSize(32);
    doc.text('Semester Final', doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, { align: 'center' });
    imageUrlToPdf(doc, final);
  }

  doc.save(name + '.pdf');
}

const imageUrlToPdf = (doc, pages) => {
  for (let i = 0; i < pages.length; i++) {
    doc.addPage('A4', 'p');
    const imageUrl = pages[i];
    const imageProp = doc.getImageProperties(imageUrl);
    const ratio = imageProp.width / imageProp.height;
    const pdfWidth = doc.internal.pageSize.width - 6;
    const pdfHeight = doc.internal.pageSize.height - 6;

    let width = pdfWidth;
    let height = width / ratio;

    if (height > pdfHeight) {
      height = pdfHeight;
      width = height * ratio;
    }
    const xOffset = (doc.internal.pageSize.width - width) / 2;
    const yOffset = (doc.internal.pageSize.height - height) / 2;
    doc.addImage(imageUrl, 'JPEG', xOffset, yOffset, width, height);
  }
};

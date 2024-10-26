import jsPDF from 'jspdf';

export default function base64ToPdf(pages, name) {
  let doc = new jsPDF();
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) doc.addPage('A4', 'p');
    const imageProp = doc.getImageProperties(pages[i]);
    const ratio = imageProp.width / imageProp.height;
    const pdfWidth = doc.internal.pageSize.width - 6;
    const pdfHeight = doc.internal.pageSize.height - 6;

    let width = pdfWidth;
    let height = width / ratio;

    if (height > pdfHeight) {
      height = pdfHeight;
      width = height * ratio;
    }

    doc.addImage(pages[i], 'JPEG', 3, 3, width, height);
  }
  doc.save(name + '.pdf');
}

import jsPDF from 'jspdf';

export default function imageUrlToPdf(pages, name) {
  let doc = new jsPDF();
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) doc.addPage('A4', 'p');
    const imageUrl = pages[i].imageUrl;
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
  doc.save(name + '.pdf');
}

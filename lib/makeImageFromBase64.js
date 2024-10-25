export default function makeImageFromBase64(data) {
  const byteCharacters = atob(data.content);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const image = new Blob([byteArray], {
    type: data.contentType + ';base64',
  });

  return URL.createObjectURL(image);
}

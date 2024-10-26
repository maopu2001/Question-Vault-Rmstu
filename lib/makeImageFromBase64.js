export default function makeImageFromBase64(data, dataType) {
  let byteCharacters;
  if (dataType === 'fileInfo') byteCharacters = atob(data.content);
  else if (dataType === 'base64') byteCharacters = atob(data.split(',')[1]);
  else throw new Error('Wrong dataType. It must be fileInfo or base64');

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

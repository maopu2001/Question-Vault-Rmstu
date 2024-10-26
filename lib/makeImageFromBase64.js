export default function makeImageFromBase64(data, dataType) {
  let base64Data;
  if (dataType === 'base64') base64Data = data.replace(/^data:image\/\w+;base64,/, '');
  else base64Data = data.content;

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpg' });

  return URL.createObjectURL(blob);
}

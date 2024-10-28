export default function convertUSTtoBST(ustString) {
  const ustDate = new Date(ustString);
  const bstOffset = 6 * 60; // BST is UTC+6
  const bstDate = new Date(ustDate.getTime() + bstOffset * 60 * 1000);
  const bstString = bstDate.toISOString().replace('Z', '');
  const [date, time] = bstString.split('T');
  let [hours, minutes, seconds] = time.split(':');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  const [year, month, day] = date.split('-');
  return `${hours}:${minutes} ${period}, ${day}/${month}/${year}`;
}

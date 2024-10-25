export default function getNonHttpCookies(cookie, key) {
  return cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`))
    ?.split('=')[1];
}

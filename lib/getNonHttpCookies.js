import jwtVerify from './jwtVerify';

export default async function getNonHttpCookies(cookie, key) {
  const cookies = cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`))
    ?.split('=')[1];
  const payload = await jwtVerify(cookies, process.env.NEXT_PUBLIC_JWT_SECRET);
  return payload;
}

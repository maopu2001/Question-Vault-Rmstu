import { SignJWT } from 'jose';

const secret = process.env.JWT_SECRET;

export default async function jwtSign(payload, options = {}) {
  const {
    expirationTime = '24h',
    notBefore = '0s',
    jwtid = undefined,
    audience = undefined,
    issuer = 'next-auth-app',
    subject = undefined,
  } = options;

  let jwt = new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt();

  if (expirationTime) jwt = jwt.setExpirationTime(expirationTime);
  if (notBefore) jwt = jwt.setNotBefore(notBefore);
  if (jwtid) jwt = jwt.setJti(jwtid);
  if (audience) jwt = jwt.setAudience(audience);
  if (issuer) jwt = jwt.setIssuer(issuer);
  if (subject) jwt = jwt.setSubject(subject);

  const token = await jwt.sign(new TextEncoder().encode(secret));

  return token;
}

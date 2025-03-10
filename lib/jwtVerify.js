import { jwtVerify as joseJwtVerify } from 'jose';

export default async function jwtVerify(token, secret) {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    const { payload } = await joseJwtVerify(token, secretKey, {
      issuer: 'next-auth-app',
    });
    return payload;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    throw new Error(`Invalid token: ${error.message}`);
  }
}

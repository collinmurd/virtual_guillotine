
import { base64url, jwtDecrypt, EncryptJWT } from 'jose';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import 'server-only';

export interface SessionData {
  accessToken: string,
  tokenExp: Date,
  refreshToken: string,
}

const secretKey = base64url.decode(process.env.SESSION_ENCRYPT_KEY!);
const cookieName = 'virtual-guillotine-session'

// @ts-ignore
export async function getSession(cookies: RequestCookies | ReadonlyRequestCookies): Promise<SessionData | null> {
  const cookie = cookies.get(cookieName);
  if (!cookie) {
    return null;
  }

  return jwtDecrypt(cookie.value, secretKey).then(result => {
    const sess = {
      accessToken: result.payload.accessToken as string,
      tokenExp: result.payload.tokenExp as Date,
      refreshToken: result.payload.refreshToken as string
    }

    if (!sess.accessToken) {
      return null;
    }

    return sess;
  })
  .catch(_ => {
    return null;
  });
}

export async function setSession(cookies: RequestCookies, data: SessionData) {
  const jwt = await new EncryptJWT({...data})
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .encrypt(secretKey)

  cookies.set(cookieName, jwt);
}

export async function destroySession(cookies: RequestCookies) {
  cookies.delete(cookieName);
}

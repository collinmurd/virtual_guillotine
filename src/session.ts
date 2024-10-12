
import { base64url, jwtDecrypt, EncryptJWT } from 'jose';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies, headers } from 'next/headers';
import 'server-only';

export interface SessionData {
  accessToken: string,
  tokenExp: string,
  refreshToken: string,
}

const secretKey = base64url.decode(process.env.SESSION_ENCRYPT_KEY!);
const cookieName = 'virtual-guillotine-session'

export async function decryptSessionCookie(cookies: RequestCookies | ReadonlyRequestCookies): Promise<SessionData | null> {
  const cookie = cookies.get(cookieName);
  if (!cookie) {
    return null;
  }

  return jwtDecrypt(cookie.value, secretKey).then(result => {
    const sess = {
      accessToken: result.payload.accessToken as string,
      tokenExp: result.payload.tokenExp as string,
      refreshToken: result.payload.refreshToken as string
    }

    if (!sess.accessToken) {
      return null;
    }

    return sess;
  })
  .catch(() => {
    return null;
  });
}

export function getSession(): SessionData | null {
  return {
    accessToken: headers().get('session-accessToken') as string,
    tokenExp: headers().get('session-tokenExp') as string,
    refreshToken: headers().get('session-refreshToken') as string,
  }
}

export async function setSession(cookies: RequestCookies | ReadonlyRequestCookies, data: SessionData) {
  const jwt = await new EncryptJWT({...data})
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .encrypt(secretKey)

  cookies.set(cookieName, jwt);
}

export async function destroySession() {
  cookies().delete(cookieName);
}

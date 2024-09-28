
import 'server-only';

export interface SessionData {
  accessToken: string,
  exp: Date,
  refreshToken: string,
}

const secretKey = process.env.SESSION_ENCRYPT_KEY!;
const cookieName = 'virtual-guillotine-session'

// @ts-ignore
export async function getSession(cookies: any): Promise<SessionData | null> {

}

export async function setSession(cookies: any, data: SessionData) {
  
}

export async function destroySession(cookies: any) {
  
}

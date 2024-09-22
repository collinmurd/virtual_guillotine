
import 'server-only';
import { getIronSession, IronSession, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { revalidatePath } from 'next/cache';

export interface SessionData {
  accessToken: string,
  exp: Date,
  refreshToken: string,
}

const sessionOpts = {
  password: process.env.SESSION_ENCRYPT_KEY!,
  cookieName: 'virtual-guillotine-session'
}

export async function getSession(): Promise<SessionData | null> {
  const encryptedSession = cookies().get(sessionOpts.cookieName)?.value;
  const session = encryptedSession
    ? await unsealData<SessionData>(encryptedSession, {
        password: sessionOpts.password
      })
    : null;

  return session;
}

export async function setSession(data: SessionData) {
  const session = await getIronSession<SessionData>(cookies(), sessionOpts);
  session.accessToken = data.accessToken;
  session.exp = data.exp;
  session.refreshToken = data.refreshToken;
  await session.save();
}

export async function destroySession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOpts);
  session.destroy();
  revalidatePath('/');
}

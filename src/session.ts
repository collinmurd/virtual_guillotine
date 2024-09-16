'use server';

import { getIronSession, IronSession } from "iron-session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface SessionData {
  accessToken: string
}

const sessionOpts = {
  password: process.env.SESSION_ENCRYPT_KEY!,
  cookieName: 'virtual-guillotine-session'
}

export async function getSession(): Promise<IronSession<SessionData> | null> {
  const session = await getIronSession<SessionData>(cookies(), sessionOpts);

  if (!session.accessToken) {
    return null;
  }

  return session;
}

export async function setSession(data: SessionData) {
  const session = await getIronSession<SessionData>(cookies(), sessionOpts);
  session.accessToken = data.accessToken;
  await session.save();
  revalidatePath('/');
}


'use server';

import { destroySession, getSession } from "@/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logIn() {
  const session = await getSession(cookies());

  // redirect to request_auth
  if (!session) {
    const client_id = process.env.CLIENT_ID!;
    const redirect_uri = 'https://localhost:3000/handle-login'
    const response_type = 'code';
    redirect(`https://api.login.yahoo.com/oauth2/request_auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}`)
  }
}

export async function logOut() {
  await destroySession(cookies());
}
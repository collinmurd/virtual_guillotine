'use server';

import { getSession } from "@/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logIn() {
  const session = await getSession();

  // redirect to request_auth
  if (!session) {
    const client_id = process.env.CLIENT_ID!;
    const redirect_uri = 'https://localhost:3000/handle-login'
    const response_type = 'code';
    redirect(`https://api.login.yahoo.com/oauth2/request_auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}`)
  }
}

export async function logOut() {
  const session = await getSession();
  if (session) {
    session.destroy();
  }
  revalidatePath('/');
}
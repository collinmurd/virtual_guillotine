'use server';

import { setSession } from "@/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleAuth(accessCode: string) {
  // handle redirect from Yahoo and set session with access token
  const getToken = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'grant_type': 'authorization_code',
      'code': accessCode,
      'redirect_uri': 'oob'
    })
  });

  // TODO handle error
  const data = await getToken.json();
  const tokenExp = new Date();
  tokenExp.setSeconds(tokenExp.getSeconds() + data.expires_in);

  await setSession(
    cookies(),
    {
      accessToken: data.access_token,
      tokenExp: tokenExp.toString(),
      refreshToken: data.refresh_token
    }
  );
  redirect('/');
}
import { NextRequest } from "next/server";
import { getSession, setSession } from "./session";

export async function middleware(req: NextRequest) {
  // refresh yahoo access token if necessary
  const session = await getSession(req.cookies);
  if (session && session.exp! < new Date()) {
    console.log('refreshing token...')
    const getToken = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': session.refreshToken,
        'redirect_uri': 'oob'
      })
    });

    // TODO: handle error from yahoo
    const data = await getToken.json();
    await setSession(
      req.cookies,
      {
      accessToken: data.token,
      exp: (new Date()) + data.expires_in,
      refreshToken: data.refresh_token
    });
  }
}

export const config = {
  matcher: '/*'
}
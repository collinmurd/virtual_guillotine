import { NextRequest, NextResponse } from "next/server";
import { decryptSessionCookie, SessionData } from "./session";

export async function middleware(req: NextRequest) {
  // set session headers for later use
  let session = await decryptSessionCookie(req.cookies);
  if (session && Date.parse(session.tokenExp!) < Date.now()) {
    session = await refreshYahooToken(session.refreshToken);
  }

  const requestHeaders = new Headers(req.headers);
  if (session) {
    // set session headers for use in the app
    requestHeaders.set('session-accessToken', session.accessToken);
    requestHeaders.set('session-tokenExp', session.tokenExp);
    requestHeaders.set('session-refreshToken', session.refreshToken);
  } else {
    // delete any 'session' headers passed in the request
    requestHeaders.delete('session-accessToken');
    requestHeaders.delete('session-tokenExp');
    requestHeaders.delete('session-refreshToken');
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

async function refreshYahooToken(refreshToken: string): Promise<SessionData> {
  const getToken = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken,
      'redirect_uri': 'oob'
    })
  });

  // TODO: handle error from yahoo
  const data = await getToken.json();
  return {
      accessToken: data.token,
      tokenExp: (new Date()) + data.expires_in,
      refreshToken: data.refresh_token
  }
}

export const config = {
  matcher: '/'
}
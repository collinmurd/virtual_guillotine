import { NextRequest, NextResponse } from "next/server";
import { decryptSessionCookie, SessionData, setSession } from "./session";

export async function middleware(req: NextRequest) {
  // set session headers for later use
  let session = await decryptSessionCookie(req.cookies);
  let tokenRefreshed = false;
  if (session && Date.parse(session.tokenExp!) < Date.now()) {
    session = await refreshYahooToken(session.refreshToken);
    tokenRefreshed = true;
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

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  if (tokenRefreshed && session) {
    await setSession(response.cookies, session);
  }

  return response;
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
  const tokenExp = new Date();
  tokenExp.setSeconds(tokenExp.getSeconds() + data.expires_in);

  return {
      accessToken: data.access_token,
      tokenExp: tokenExp.toString(),
      refreshToken: data.refresh_token
  }
}

export const config = {
  matcher: '/'
}
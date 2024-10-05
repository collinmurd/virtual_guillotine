import type { Metadata } from "next";
import "./globals.css";
import { getSession } from "@/session";
import { logIn, logOut } from "./actions";
import { cookies } from "next/headers";
import * as yahoo from "../apis/yahoo";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="p-3 max-w-2xl">
          <header className="flex justify-between mb-5">
            <Account />
            <Week />
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

async function Account() {
  const session = await getSession(cookies());

  if (session) {
    return (
      <form action={logOut}>
        <button>Log Out</button>
      </form>
    )
  } else {
    return (
      <form action={logIn}>
        <button type="submit">Log In</button>
      </form>
    );
  }
}

async function Week() {
  const league = await yahoo.getLeague();

  return (
    <div>Week: {league.current_week}</div>
  )
}

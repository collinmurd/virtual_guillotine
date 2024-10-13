import type { Metadata } from "next";
import "./globals.css";
import { getSession } from "@/session";
import { logIn, logOut } from "./actions";
import * as yahoo from "../apis/yahoo";
import { Source_Code_Pro } from "next/font/google";

export const metadata: Metadata = {
  title: "Virtual Guillotine",
  description: "Scoreboard for our guillotine league",
};

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceCodePro.variable}`}>
      <body>
        <div className="p-3 max-w-2xl">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}

async function Header() {
  const session = await getSession();

  return (
    <header className="flex justify-between mb-5">
      <Account loggedIn={session != null} />
      {session != null && <Week /> }
    </header>
  )
}

async function Account(props: {loggedIn: boolean}) {
  if (props.loggedIn) {
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

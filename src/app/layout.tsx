import type { Metadata } from "next";
import "./globals.css";
import { getSession } from "@/session";
import { logIn, logOut } from "./actions";
import * as yahoo from "../apis/yahoo";
import { Source_Code_Pro } from "next/font/google";
import Link from "next/link";

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
    <header className="mb-5">
      <div className="flex justify-between">
        <Account loggedIn={session != null} />
        {session != null && <Week /> }
      </div>
      <nav className="flex justify-center">
        <Link href="/" className="mx-2 underline">Scores</Link>
        <Link href="/team" className="mx-2 underline">Team</Link>
      </nav>
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

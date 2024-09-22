import type { Metadata } from "next";
import "./globals.css";
import { getSession } from "@/session";
import { logIn, logOut } from "./actions";
import { cookies } from "next/headers";

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
        <header>
          <Account />
        </header>
        {children}
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

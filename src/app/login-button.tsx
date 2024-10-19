'use client'

import { useState } from "react"
import { logIn } from "./actions"

export function LoginButton() {
  const [loggingIn, setLoggingIn] = useState(false);

  function loginClicked() {
    setLoggingIn(true);
    logIn();
  }

  if (!loggingIn) {
    return (
      <button type="submit" onClick={() => loginClicked()}>Log In</button>
    )
  } else {
    return (
      <p>Logging in...</p>
    )
  }
}
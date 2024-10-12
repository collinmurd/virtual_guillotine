'use client'

import { useRouter } from "next/navigation";

export function Refresh() {
  const router = useRouter();

  return <button className="underline" onClick={() => router.refresh()}>Refresh</button>
}
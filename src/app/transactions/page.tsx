import { LoadingFallback } from "@/shared-components/loading-fallback";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Content />
    </Suspense>
  )
}

async function Content() {
  return (
    <p>Transactions</p>
  )
}
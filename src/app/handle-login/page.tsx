'use client';

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { handleAuth } from "./actions";


export default function HandleLogin() {
  const params = useSearchParams();
  useEffect(() => {
    // TODO handle error on redirect from yahoo (or missing code)
    handleAuth(params.get('code')!);
  }, []);

  return (<></>)
}
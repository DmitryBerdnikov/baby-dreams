'use client';

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/days/${new Date().toISOString().substring(0, 10)}`)
  }, [router]);

  return null
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthenticate = () => {
  const router = useRouter();

  useEffect(() => {
    const username = window.sessionStorage.getItem("username");

    if (!username) {
      router.push("/login");
    }
  }, [router]);
};

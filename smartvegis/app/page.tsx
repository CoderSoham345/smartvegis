"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.replace("/dashboard");
      else router.replace("/login");
    };
    checkAuth();
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">⏳ Loading...</div>;
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

/* 🌐 Bilingual Text */
const TEXT = {
  en: {
    title: "Reset Password",
    newPassword: "New Password",
    button: "Set New Password",
    updating: "Updating...",
    success: "Password updated successfully",
    enter: "Enter new password",
    invalid: "Invalid or expired reset link",
    verifying: "Verifying reset link...",
  },
  hi: {
    title: "पासवर्ड रीसेट करें",
    newPassword: "नया पासवर्ड",
    button: "नया पासवर्ड सेट करें",
    updating: "अपडेट हो रहा है...",
    success: "पासवर्ड सफलतापूर्वक बदल दिया गया",
    enter: "नया पासवर्ड दर्ज करें",
    invalid: "रीसेट लिंक अमान्य या एक्सपायर हो चुका है",
    verifying: "रीसेट लिंक सत्यापित किया जा रहा है...",
  },
};

export default function ResetPasswordPage() {
  const router = useRouter();

  const [lang, setLang] = useState<"en" | "hi">("en");
  const t = TEXT[lang];

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  /* 🔍 VERIFY RESET SESSION */
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setValid(true);
      } else {
        alert(`❌ ${t.invalid}`);
        router.push("/login");
      }

      setChecking(false);
    };

    checkSession();
  }, [router, t.invalid]);

  /* 🔐 UPDATE PASSWORD */
  const updatePassword = async () => {
    if (!password) {
      alert(t.enter);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert(`✅ ${t.success}`);
      await supabase.auth.signOut();
      router.push("/login");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ {t.verifying}
      </div>
    );
  }

  if (!valid) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-6 rounded-xl shadow w-80">

        {/* 🌐 Language Toggle */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="text-sm text-blue-600"
          >
            🌐 {lang === "en" ? "हिंदी" : "English"}
          </button>
        </div>

        <h2 className="text-xl font-bold text-center mb-4">
          🔐 {t.title}
        </h2>

        <input
          type="password"
          className="border p-2 mb-3 w-full"
          placeholder={`🔑 ${t.newPassword}`}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={updatePassword}
          disabled={loading}
          className={`w-full py-2 rounded ${
            loading ? "bg-gray-400" : "bg-green-600 text-white"
          }`}
        >
          {loading ? `⏳ ${t.updating}` : `✅ ${t.button}`}
        </button>
      </div>
    </div>
  );
}

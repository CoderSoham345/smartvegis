"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

/* 🌐 Bilingual Text */
const TEXT = {
  en: {
    login: "Login",
    signup: "Signup",
    email: "Email",
    password: "Password",
    name: "Your Name",
    shopName: "Shop Name",
    address: "Shop Address",
    city: "City",
    state: "State",
    forgot: "Forgot password?",
    sendLink: "Send reset link",
    back: "Back to login",
    creating: "Creating account...",
    logging: "Logging in...",
    resetSent: "Password reset link sent to email",
  },
  hi: {
    login: "लॉगिन",
    signup: "साइन अप",
    email: "ईमेल",
    password: "पासवर्ड",
    name: "आपका नाम",
    shopName: "दुकान का नाम",
    address: "दुकान का पता",
    city: "शहर",
    state: "राज्य",
    forgot: "पासवर्ड भूल गए?",
    sendLink: "रीसेट लिंक भेजें",
    back: "लॉगिन पर वापस जाएं",
    creating: "अकाउंट बनाया जा रहा है...",
    logging: "लॉगिन हो रहा है...",
    resetSent: "रीसेट लिंक ईमेल पर भेज दिया गया है",
  },
};

export default function LoginPage() {
  const router = useRouter();

  const [lang, setLang] = useState<"en" | "hi">("en");
  const t = TEXT[lang];

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  /* 🔓 LOGIN */
  const login = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) alert(error.message);
    else router.push("/");
  };

  /* 📝 SIGNUP WITH SHOP DETAILS */
  const signup = async () => {
    if (!name || !email || !password || !shopName) {
      alert("Fill all required fields");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    await supabase.from("profiles").insert({
      id: data.user?.id,
      name,
      shop_name: shopName,
      address,
      city,
      state,
    });

    setLoading(false);
    router.push("/");
  };

  /* 🔁 FORGOT PASSWORD */
  const forgotPassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/login/resetpassword",
    });
    setLoading(false);

    if (error) alert(error.message);
    else alert(`📧 ${t.resetSent}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-6 rounded-xl shadow w-96">

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
          🔐 {mode === "login" ? t.login : mode === "signup" ? t.signup : t.forgot}
        </h2>

        {/* SIGNUP EXTRA FIELDS */}
        {mode === "signup" && (
          <>
            <input className="input" placeholder={`👤 ${t.name}`} onChange={e => setName(e.target.value)} />
            <input className="input" placeholder={`🏪 ${t.shopName}`} onChange={e => setShopName(e.target.value)} />
            <input className="input" placeholder={`📍 ${t.address}`} onChange={e => setAddress(e.target.value)} />
            <input className="input" placeholder={`🌆 ${t.city}`} onChange={e => setCity(e.target.value)} />
            <input className="input" placeholder={`🗺️ ${t.state}`} onChange={e => setState(e.target.value)} />
          </>
        )}

        {/* COMMON FIELDS */}
        <input className="input" placeholder={`📧 ${t.email}`} onChange={e => setEmail(e.target.value)} />
        {mode !== "forgot" && (
          <input type="password" className="input" placeholder={`🔑 ${t.password}`} onChange={e => setPassword(e.target.value)} />
        )}

        {/* ACTION BUTTON */}
        <button
          onClick={mode === "login" ? login : mode === "signup" ? signup : forgotPassword}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded mt-2"
        >
          {loading
            ? mode === "signup" ? t.creating : t.logging
            : mode === "login" ? "Login" : mode === "signup" ? "Create Account" : t.sendLink}
        </button>

        {/* LINKS */}
        <div className="text-center mt-3 text-sm">
          {mode === "login" && (
            <>
              <button onClick={() => setMode("forgot")} className="text-blue-600 block">
                🔁 {t.forgot}
              </button>
              <button onClick={() => setMode("signup")} className="text-blue-600 block">
                📝 Create new account
              </button>
            </>
          )}

          {(mode === "signup" || mode === "forgot") && (
            <button onClick={() => setMode("login")} className="text-blue-600">
              ⬅️ {t.back}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          border: 1px solid #ccc;
          padding: 8px;
          margin-bottom: 8px;
          width: 100%;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}


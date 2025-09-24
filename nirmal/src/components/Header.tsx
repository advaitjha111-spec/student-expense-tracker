"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal";

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between w-full p-4 sm:p-6">
        <div className="text-xl sm:text-2xl font-semibold tracking-wide">NIRMAL</div>
        <div className="flex items-center gap-3">
          <select aria-label="Language" className="border rounded px-2 py-1 bg-background text-foreground">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="mr">मराठी</option>
          </select>
          <button onClick={() => setAuthOpen(true)} className="rounded bg-foreground text-background px-3 py-2">
            Sign in / Sign up
          </button>
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}


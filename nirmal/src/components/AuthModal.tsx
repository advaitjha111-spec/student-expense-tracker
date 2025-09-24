"use client";

import { useState } from "react";

type Step = "phone" | "otp" | "aadhaar" | "done";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [consent, setConsent] = useState(false);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-background text-foreground shadow-xl border border-foreground/10">
        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
          <h2 className="text-lg font-semibold">Sign in / Sign up</h2>
          <button aria-label="Close" onClick={onClose} className="rounded p-1 hover:bg-foreground/10">✕</button>
        </div>

        <div className="p-4 space-y-4">
          {step === "phone" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!consent) return;
                setStep("otp");
              }}
              className="space-y-3"
            >
              <label className="block" htmlFor="phone">
                <span className="text-sm">Phone number</span>
                <input
                  id="phone"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded border border-foreground/20 bg-background px-3 py-2"
                />
              </label>

              <div className="text-xs text-foreground/70">
                Optional eKYC via Aadhaar will only be used for validation, never shared. Data is stored securely per our privacy policy.
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
                <span>
                  I consent to the processing of my data. See
                  {" "}
                  <a className="underline" href="#" onClick={(e) => e.preventDefault()}>
                    Privacy
                  </a>
                  {" / "}
                  <a className="underline" href="#" onClick={(e) => e.preventDefault()}>
                    Terms
                  </a>
                  .
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!consent || phone.length !== 10}
                  className="rounded bg-foreground text-background px-4 py-2 disabled:opacity-50"
                >
                  Send OTP
                </button>
                <button type="button" onClick={() => setStep("aadhaar")} className="rounded border px-4 py-2">
                  Use Aadhaar eKYC
                </button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("done");
              }}
              className="space-y-3"
            >
              <label className="block" htmlFor="otp">
                <span className="text-sm">Enter OTP</span>
                <input
                  id="otp"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 w-full rounded border border-foreground/20 bg-background px-3 py-2"
                />
              </label>
              <div className="flex gap-2">
                <button type="submit" className="rounded bg-foreground text-background px-4 py-2">
                  Verify
                </button>
                <button type="button" onClick={() => setStep("phone")} className="rounded border px-4 py-2">
                  Back
                </button>
              </div>
            </form>
          )}

          {step === "aadhaar" && (
            <div className="space-y-3">
              <div className="text-sm">Aadhaar eKYC placeholder. Integrate SDK/provider in production.</div>
              <div className="flex gap-2">
                <button onClick={() => setStep("done")} className="rounded bg-foreground text-background px-4 py-2">
                  Continue
                </button>
                <button onClick={() => setStep("phone")} className="rounded border px-4 py-2">
                  Back
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-3">
              <div className="text-sm">Authenticated. You can close this window.</div>
              <button onClick={onClose} className="rounded bg-foreground text-background px-4 py-2">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


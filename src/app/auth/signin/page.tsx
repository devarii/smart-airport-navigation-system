"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Email atau password salah."); return; }
    router.push("/admin");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
        }

        /* ─── Left: deep navy panel ─── */
        .lp-left {
          background: #0F1D3A;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 56px;
          position: relative;
          overflow: hidden;
        }
        /* subtle light sweep */
        .lp-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 55% at 0% 100%, rgba(99,152,255,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 100% 0%,  rgba(99,152,255,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        /* fine dot-grid texture */
        .lp-left::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        .lp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .lp-brand-mark {
          width: 36px; height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.14);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lp-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 500;
          color: rgba(255,255,255,0.80);
          letter-spacing: 0.3px;
        }

        .lp-tagline {
          position: relative;
          z-index: 1;
        }
        .lp-tagline-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.55rem;
          font-weight: 400;
          font-style: italic;
          color: rgba(255,255,255,0.88);
          line-height: 1.22;
          letter-spacing: -0.3px;
          margin-bottom: 22px;
        }
        .lp-tagline-line {
          width: 28px; height: 1px;
          background: rgba(99,152,255,0.45);
          margin-bottom: 14px;
        }
        .lp-tagline-sub {
          font-size: 0.66rem;
          font-weight: 400;
          color: rgba(255,255,255,0.28);
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }

        /* ─── Right: pale blue form panel ─── */
        .lp-right {
          background: #F0F4FB;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 52px 64px;
          animation: fadeIn 0.55s ease both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .lp-form-wrap {
          width: 100%;
          max-width: 340px;
        }

        .lp-hello {
          font-size: 0.66rem;
          font-weight: 500;
          color: #7A90B8;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .lp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.3rem;
          font-weight: 500;
          color: #0F1D3A;
          line-height: 1.15;
          letter-spacing: -0.3px;
          margin-bottom: 44px;
        }

        .lp-fields { display: flex; flex-direction: column; gap: 30px; }

        .lp-field { display: flex; flex-direction: column; }

        .lp-label {
          font-size: 0.64rem;
          font-weight: 500;
          color: #7A90B8;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .lp-input-row {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #C8D5EC;
          padding-bottom: 10px;
          transition: border-color 0.22s;
        }
        .lp-input-row:focus-within { border-color: #2355B0; }

        .lp-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          font-weight: 400;
          color: #0F1D3A;
        }
        .lp-input::placeholder { color: #AABCD8; }

        .lp-eye {
          background: none;
          border: none;
          cursor: pointer;
          color: #AABCD8;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .lp-eye:hover { color: #2355B0; }

        .lp-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -8px;
        }
        .lp-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .lp-remember input {
          width: 13px; height: 13px;
          accent-color: #2355B0;
          cursor: pointer;
        }
        .lp-remember-txt { font-size: 0.74rem; font-weight: 400; color: #7A90B8; }
        .lp-forgot      { font-size: 0.74rem; font-weight: 400; color: #7A90B8; cursor: default; user-select: none; }

        .lp-error {
          font-size: 0.75rem;
          color: #A85252;
          font-weight: 400;
        }

        /* solid navy button */
        .lp-btn {
          width: 100%;
          padding: 15px;
          border: none;
          cursor: pointer;
          background: #0F1D3A;
          color: #EEF3FF;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.70rem;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 0;
          margin-top: 4px;
          transition: background 0.2s, transform 0.15s;
        }
        .lp-btn:hover:not(:disabled)  { background: #1A3260; }
        .lp-btn:active:not(:disabled) { transform: scale(0.99); }
        .lp-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .lp-footer {
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid #D4DFEF;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lp-footer-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #AABCD8;
          flex-shrink: 0;
        }
        .lp-footer-txt {
          font-size: 0.66rem;
          font-weight: 300;
          color: #AABCD8;
          letter-spacing: 0.2px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .spinning { animation: spin 0.8s linear infinite; }

        @media (max-width: 768px) {
          .lp-root { grid-template-columns: 1fr; }
          .lp-left { display: none; }
          .lp-right { padding: 48px 32px; }
        }
      `}</style>

      <div className="lp-root">

        {/* ── Left: navy branding ── */}
        <div className="lp-left">
          <div className="lp-brand">
            <div className="lp-brand-mark">
              <Image
                src="/logo.svg"
                alt="InJourney"
                width={20}
                height={20}
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <span className="lp-brand-name">InJourney Airports</span>
          </div>

          <div className="lp-tagline">
            <p className="lp-tagline-quote">
              Manage with<br />clarity & purpose.
            </p>
            <div className="lp-tagline-line" />
            <p className="lp-tagline-sub">Admin Portal</p>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div className="lp-right">
          <div className="lp-form-wrap">
            <p className="lp-hello">Welcome back</p>
            <h1 className="lp-title">Sign in to<br />your account</h1>

            <form onSubmit={handleSubmit} className="lp-fields">

              <div className="lp-field">
                <label className="lp-label">Email address</label>
                <div className="lp-input-row">
                  <input
                    type="email"
                    className="lp-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="lp-field">
                <label className="lp-label">Password</label>
                <div className="lp-input-row">
                  <input
                    type={showPw ? "text" : "password"}
                    className="lp-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="lp-eye"
                    onClick={() => setShowPw(!showPw)}
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="lp-meta">
                <label className="lp-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="lp-remember-txt">Keep me signed in</span>
                </label>
                <span className="lp-forgot">Forgot password?</span>
              </div>

              {error && <p className="lp-error">⚠ {error}</p>}

              <button type="submit" disabled={loading} className="lp-btn">
                {loading
                  ? <><Loader2 size={13} className="spinning" /> Signing in</>
                  : "Sign in"
                }
              </button>

            </form>

            <div className="lp-footer">
              <div className="lp-footer-dot" />
              <p className="lp-footer-txt">
                Secured connection · End-to-end encrypted · Admin access only
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
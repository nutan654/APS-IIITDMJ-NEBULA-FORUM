"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in, redirect
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push("/");
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An alignment error occurred.");
      }

      if (isLogin) {
        setMessage(data.message || "Session secured!");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        setMessage(data.message + " You may now login.");
        setIsLogin(true);
        setName("");
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: quickEmail, password: "nebula123" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An alignment error occurred.");
      }

      setMessage(data.message || "Session secured!");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      {/* Dynamic Starfield Background */}
      <div id="starfield-login"></div>

      <div className="login-box ornate-card">
        <div className="corner-tl"></div>
        <div className="corner-tr"></div>
        <div className="corner-bl"></div>
        <div className="corner-br"></div>

        <div className="login-logo">✦ NEBULA ✦</div>
        <div className="login-subtitle">Astronomy & Physics Society</div>
        <div className="login-rule"></div>

        <div className="login-tabs">
          <button
            type="button"
            className={isLogin ? "tab-active" : "tab-inactive"}
            onClick={() => {
              setIsLogin(true);
              setError("");
              setMessage("");
            }}
          >
            Commune (Login)
          </button>
          <button
            type="button"
            className={!isLogin ? "tab-active" : "tab-inactive"}
            onClick={() => {
              setIsLogin(false);
              setError("");
              setMessage("");
            }}
          >
            Initiate (Register)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="input-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="e.g. Arjun Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Stellar Coordinates (Email)</label>
            <input
              type="email"
              placeholder="e.g. stargazer@nebula.aps"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Secret Passphrase (Password)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}
          {message && <div className="success-message">✦ {message}</div>}

          <button type="submit" className="cta-btn submit-btn" disabled={loading}>
            {loading ? "Aligning..." : isLogin ? "Cross Threshold ✦" : "Submit Fellowship Petition ✦"}
          </button>
        </form>

        <div className="login-rule"></div>
        <div className="quick-commune-section" style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--ink)", marginBottom: "0.8rem", textTransform: "uppercase" }}>
            ✦ Quick Fellowship Entrance ✦
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            <button
              type="button"
              className="quick-auth-btn"
              onClick={() => handleQuickLogin("admin@nebula.aps")}
              style={{
                background: "rgba(201, 162, 39, 0.05)",
                border: "1px solid rgba(201, 162, 39, 0.4)",
                color: "var(--gold-bright)",
                fontFamily: "Spectral, serif",
                fontSize: "0.8rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              Galileo (High Priest)
            </button>
            <button
              type="button"
              className="quick-auth-btn"
              onClick={() => handleQuickLogin("arjun@nebula.aps")}
              style={{
                background: "rgba(201, 162, 39, 0.05)",
                border: "1px solid rgba(201, 162, 39, 0.4)",
                color: "var(--gold-bright)",
                fontFamily: "Spectral, serif",
                fontSize: "0.8rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              Arjun (Scholar)
            </button>
            <button
              type="button"
              className="quick-auth-btn"
              onClick={() => handleQuickLogin("rohan@nebula.aps")}
              style={{
                background: "rgba(201, 162, 39, 0.05)",
                border: "1px solid rgba(201, 162, 39, 0.4)",
                color: "var(--gold-bright)",
                fontFamily: "Spectral, serif",
                fontSize: "0.8rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              Rohan (Novice)
            </button>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button
            type="button"
            className="back-btn"
            onClick={() => router.push("/")}
          >
            ← Return to Outer Canopy
          </button>
        </div>
      </div>

      <style>{`
        :root {
          --gold: #c9a227;
          --gold-bright: #f0d060;
          --gold-pale: #e8dfc0;
          --parchment: #d4c5a0;
          --deep-space: #03020a;
          --space-navy: #08071a;
          --cosmic-purple: #2a0e4a;
          --glow-blue: #4a90d9;
          --glow-teal: #3dcdc4;
          --star-white: #f5f0e8;
          --ink: #c8b888;
          --fade: #8a7a60;
          --blood-red: #8b0000;
        }

        body {
          background: var(--deep-space);
          color: var(--parchment);
          font-family: 'IM Fell English', Georgia, serif;
          margin: 0;
          padding: 0;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: radial-gradient(circle at 50% 50%, rgba(42, 14, 74, 0.4) 0%, rgba(3, 2, 10, 0.95) 80%);
          padding: 2rem;
          overflow: hidden;
        }

        #starfield-login {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          background-image: 
            radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
            radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
            radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px);
          background-size: 550px 550px, 350px 350px, 250px 250px;
          background-position: 0 0, 40px 60px, 130px 270px;
          opacity: 0.2;
        }

        .ornate-card {
          background: linear-gradient(135deg, rgba(42, 14, 74, 0.8) 0%, rgba(8, 7, 26, 0.95) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          position: relative;
          padding: 3.5rem 3rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(201, 162, 39, 0.1);
          z-index: 10;
          border-radius: 12px;
        }

        .ornate-card .corner-tl { position: absolute; top: -1px; left: -1px; width: 20px; height: 20px; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold); }
        .ornate-card .corner-tr { position: absolute; top: -1px; right: -1px; width: 20px; height: 20px; border-top: 2px solid var(--gold); border-right: 2px solid var(--gold); }
        .ornate-card .corner-bl { position: absolute; bottom: -1px; left: -1px; width: 20px; height: 20px; border-bottom: 2px solid var(--gold); border-left: 2px solid var(--gold); }
        .ornate-card .corner-br { position: absolute; bottom: -1px; right: -1px; width: 20px; height: 20px; border-bottom: 2px solid var(--gold); border-right: 2px solid var(--gold); }

        .login-logo {
          font-family: 'Cinzel Decorative', serif;
          font-size: 2.2rem;
          color: var(--gold);
          text-shadow: 0 0 20px rgba(201, 162, 39, 0.6);
          letter-spacing: 0.2em;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          color: var(--fade);
          text-transform: uppercase;
          text-align: center;
        }

        .login-rule {
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 1.5rem auto;
        }

        .login-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(201, 162, 39, 0.15);
          padding-bottom: 0.8rem;
        }

        .login-tabs button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.3s;
          padding: 0.5rem 1rem;
        }

        .tab-active {
          color: var(--gold-bright);
          text-shadow: 0 0 10px rgba(240, 208, 96, 0.5);
          border-bottom: 2px solid var(--gold);
        }

        .tab-inactive {
          color: var(--fade);
        }

        .tab-inactive:hover {
          color: var(--parchment);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-family: 'Cinzel', serif;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--ink);
        }

        .input-group input {
          background: rgba(3, 2, 10, 0.8);
          border: 1px solid rgba(201, 162, 39, 0.25);
          color: var(--parchment);
          font-family: 'Spectral', serif;
          padding: 0.8rem 1rem;
          font-size: 0.95rem;
          border-radius: 4px;
          outline: none;
          transition: all 0.3s;
        }

        .input-group input:focus {
          border-color: var(--gold-bright);
          box-shadow: 0 0 10px rgba(201, 162, 39, 0.2);
        }

        .error-message {
          font-family: 'Spectral', serif;
          font-size: 0.9rem;
          color: #ff5555;
          text-align: center;
        }

        .success-message {
          font-family: 'Spectral', serif;
          font-size: 0.9rem;
          color: var(--glow-teal);
          text-align: center;
        }

        .cta-btn {
          font-family: 'Spectral', serif;
          font-size: 0.9rem;
          letter-spacing: 0.15em;
          color: var(--deep-space);
          background: linear-gradient(135deg, var(--gold), var(--gold-bright));
          padding: 0.9rem;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 20px rgba(201, 162, 39, 0.3);
          border-radius: 4px;
          transition: all 0.3s;
          font-weight: 700;
          margin-top: 1rem;
        }

        .cta-btn:hover:not(:disabled) {
          box-shadow: 0 0 35px rgba(201, 162, 39, 0.6);
          transform: translateY(-1px);
        }

        .cta-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          color: var(--fade);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: color 0.3s;
        }

        .back-btn:hover {
          color: var(--gold);
        }
      `}</style>
    </main>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, User, KeyRound, Loader2 } from "lucide-react";
import { api, setSession } from "../api";

const LOGO = process.env.PUBLIC_URL + "/logo.svg";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState("credentials"); // credentials | pin
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [midToken, setMidToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pinRef = useRef(null);

  useEffect(() => {
    if (step === "pin" && pinRef.current) pinRef.current.focus();
  }, [step]);

  async function onCredentials(e) {
    e.preventDefault();
    setError("");
    if (!userName.trim()) return setError("User ID cannot be blank.");
    if (!password.trim()) return setError("Password cannot be blank.");
    setLoading(true);
    try {
      const res = await api.login(userName.trim(), password);
      if (res.Status && res.Data?.Token) {
        setMidToken(res.Data.Token);
        setStep("pin");
      } else {
        setError(res.Message || "Invalid email or password.");
      }
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onPin(e) {
    e.preventDefault();
    setError("");
    if (!pin.trim()) return setError("PIN cannot be blank.");
    setLoading(true);
    try {
      const res = await api.verifyPin(midToken, pin);
      if (res.Status && res.Data?.Token) {
        setSession(res.Data.Token, {
          name: res.Data.UserDisplayName,
          role: res.Data.Role,
        });
        navigate("/dashboard");
      } else {
        setError(res.Message || "Invalid PIN.");
      }
    } catch {
      setError("Unable to verify PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="kx-auth">
      {/* Left brand panel */}
      <div className="kx-auth__brand">
        <div className="kx-auth__brandInner">
          <img src={LOGO} alt="Kinntegra" className="kx-auth__logo" />
          <h1>Kinntegra Wealth</h1>
          <p>Comprehensive wealth &amp; mutual-fund advisory platform.</p>
          <div className="kx-auth__stats">
            <div><span>2,000+</span><small>Clients managed</small></div>
            <div><span>BSE StarMF</span><small>Member ID 19941</small></div>
            <div><span>ARN-145633</span><small>AMFI registered</small></div>
          </div>
        </div>
        <div className="kx-auth__glow" />
      </div>

      {/* Right form panel */}
      <div className="kx-auth__form">
        <div className="kx-auth__card">
          <img src={LOGO} alt="Kinntegra" className="kx-auth__logoMobile" />
          <AnimatePresence mode="wait">
            {step === "credentials" ? (
              <motion.form
                key="credentials"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
                onSubmit={onCredentials}
                data-testid="login-credentials-form"
              >
                <p className="kx-eyebrow">Welcome back</p>
                <h2>Sign in to your account</h2>

                <label className="kx-field">
                  <span>User ID / PAN</span>
                  <div className="kx-input">
                    <User size={18} />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value.toUpperCase())}
                      autoComplete="username"
                      placeholder="Enter your User ID or PAN"
                      data-testid="login-userid-input"
                    />
                  </div>
                </label>

                <label className="kx-field">
                  <span>Password</span>
                  <div className="kx-input">
                    <Lock size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      data-testid="login-password-input"
                    />
                  </div>
                </label>

                {error && <div className="kx-error" data-testid="login-error">{error}</div>}

                <button className="kx-btn" type="submit" disabled={loading} data-testid="login-submit-button">
                  {loading ? <Loader2 className="kx-spin" size={18} /> : <>Continue <ArrowRight size={18} /></>}
                </button>
                <div className="kx-sub"><a href="#forgot" onClick={(e) => e.preventDefault()}>Forgot Password?</a></div>
              </motion.form>
            ) : (
              <motion.form
                key="pin"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
                onSubmit={onPin}
                data-testid="login-pin-form"
              >
                <p className="kx-eyebrow">One more step</p>
                <h2>Enter your PIN</h2>
                <label className="kx-field">
                  <span>Security PIN</span>
                  <div className="kx-input">
                    <KeyRound size={18} />
                    <input
                      ref={pinRef}
                      type="password"
                      inputMode="numeric"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter your PIN"
                      data-testid="login-pin-input"
                    />
                  </div>
                </label>

                {error && <div className="kx-error" data-testid="login-error">{error}</div>}

                <button className="kx-btn" type="submit" disabled={loading} data-testid="login-pin-submit-button">
                  {loading ? <Loader2 className="kx-spin" size={18} /> : <>Sign in <ArrowRight size={18} /></>}
                </button>
                <div className="kx-sub">
                  <a href="#back" onClick={(e) => { e.preventDefault(); setStep("credentials"); setError(""); }}>
                    Use a different account
                  </a>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="kx-legal">
            Kinntegra Wealth Private Limited · CIN U74999MH2018PTC306145<br />
            AMFI Registration ARN-145633 · BSE StarMF Member ID 19941
          </div>
        </div>
      </div>
    </div>
  );
}

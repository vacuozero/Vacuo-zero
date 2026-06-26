import React, { useState } from "react";
import { supabase } from "./supabase.js";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

/* ── Design tokens (iguais ao App.jsx) ─────────────────────────────────── */
const C = {
  bg:       "#080A0F",
  surface:  "#0D0F17",
  card:     "#111420",
  border:   "#1A1D2E",
  text:     "#E8EAFF",
  muted:    "#5A5D7A",
  neon:     "#4F6EF7",
  neonGlow: "rgba(79,110,247,0.25)",
  purple:   "#7C3AED",
  green:    "#00E5A0",
  red:      "#FF4757",
};

/* ── Estilos inline base ────────────────────────────────────────────────── */
const s = {
  wrap: {
    minHeight: "100dvh",
    background: C.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },
  orb1: {
    position: "absolute", borderRadius: "50%", filter: "blur(100px)",
    width: 500, height: 500, top: -150, left: -100,
    background: "radial-gradient(circle, rgba(79,110,247,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute", borderRadius: "50%", filter: "blur(100px)",
    width: 400, height: 400, bottom: -100, right: -80,
    background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 24,
    padding: "40px 36px",
    position: "relative",
    zIndex: 1,
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  },
  logo: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10, marginBottom: 32,
  },
  logoIcon: {
    width: 44, height: 44, borderRadius: 12,
    background: `linear-gradient(135deg, ${C.neon}, ${C.purple})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 6px 20px ${C.neonGlow}`,
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 20, fontWeight: 800, color: C.text,
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 24, fontWeight: 800, color: C.text,
    textAlign: "center", marginBottom: 6, letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 14, color: C.muted, textAlign: "center", marginBottom: 32, lineHeight: 1.6,
  },
  tabs: {
    display: "flex", background: C.surface,
    border: `1px solid ${C.border}`, borderRadius: 12,
    padding: 4, marginBottom: 28, gap: 4,
  },
  tab: (active) => ({
    flex: 1, padding: "9px 0", borderRadius: 9, border: "none",
    fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s",
    background: active ? `linear-gradient(135deg, ${C.neon}, ${C.purple})` : "transparent",
    color: active ? "#fff" : C.muted,
    boxShadow: active ? `0 4px 16px ${C.neonGlow}` : "none",
  }),
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12, fontWeight: 600, color: C.muted,
    display: "block", marginBottom: 7, letterSpacing: "0.04em", textTransform: "uppercase",
  },
  inputWrap: {
    position: "relative", display: "flex", alignItems: "center",
  },
  inputIcon: {
    position: "absolute", left: 14, color: C.muted, pointerEvents: "none",
  },
  input: (hasRightIcon) => ({
    width: "100%",
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 11,
    padding: `11px 14px 11px ${hasRightIcon !== false ? "42px" : "14px"}`,
    paddingRight: hasRightIcon ? 42 : 14,
    fontSize: 14, color: C.text,
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  }),
  eyeBtn: {
    position: "absolute", right: 12, background: "none", border: "none",
    cursor: "pointer", color: C.muted, display: "flex", alignItems: "center",
    padding: 4,
  },
  errorBox: {
    background: "rgba(255,71,87,0.08)",
    border: `1px solid rgba(255,71,87,0.25)`,
    borderRadius: 10, padding: "11px 14px",
    display: "flex", alignItems: "flex-start", gap: 10,
    marginBottom: 18, fontSize: 13, color: C.red, lineHeight: 1.5,
  },
  successBox: {
    background: "rgba(0,229,160,0.08)",
    border: `1px solid rgba(0,229,160,0.2)`,
    borderRadius: 10, padding: "11px 14px",
    display: "flex", alignItems: "flex-start", gap: 10,
    marginBottom: 18, fontSize: 13, color: C.green, lineHeight: 1.5,
  },
  btn: (loading) => ({
    width: "100%", padding: "13px",
    background: loading ? C.muted : `linear-gradient(135deg, ${C.neon}, ${C.purple})`,
    color: "#fff", border: "none", borderRadius: 12,
    fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: 8,
    boxShadow: loading ? "none" : `0 8px 24px ${C.neonGlow}`,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "transform 0.15s, box-shadow 0.15s",
  }),
  divider: {
    display: "flex", alignItems: "center", gap: 12, margin: "22px 0",
  },
  dividerLine: {
    flex: 1, height: 1, background: C.border,
  },
  dividerText: {
    fontSize: 12, color: C.muted,
  },
  footer: {
    textAlign: "center", marginTop: 24,
    fontSize: 12, color: C.muted, lineHeight: 1.7,
  },
};

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════════ */
export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode]           = useState("login");   // "login" | "signup" | "reset"
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  /* ── Reset state when switching modes ─────────────────────────────────── */
  function switchMode(m) {
    setMode(m);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirm("");
  }

  /* ── Traduz erros do Supabase para PT-BR ──────────────────────────────── */
  function translateError(msg = "") {
    if (msg.includes("Invalid login credentials"))  return "E-mail ou senha incorretos.";
    if (msg.includes("Email not confirmed"))        return "Confirme seu e-mail antes de entrar.";
    if (msg.includes("User already registered"))    return "Este e-mail já está cadastrado.";
    if (msg.includes("Password should be at least")) return "A senha precisa ter no mínimo 6 caracteres.";
    if (msg.includes("Unable to validate email"))   return "E-mail inválido.";
    if (msg.includes("rate limit"))                 return "Muitas tentativas. Aguarde alguns minutos.";
    return msg || "Erro inesperado. Tente novamente.";
  }

  /* ── LOGIN ────────────────────────────────────────────────────────────── */
  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    setLoading(true); setError(""); setSuccess("");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(translateError(err.message)); return; }
    onAuthenticated(data.user);
  }

  /* ── CADASTRO ─────────────────────────────────────────────────────────── */
  async function handleSignup(e) {
    e.preventDefault();
    if (!email || !password || !confirm) { setError("Preencha todos os campos."); return; }
    if (password.length < 6)             { setError("A senha precisa ter no mínimo 6 caracteres."); return; }
    if (password !== confirm)            { setError("As senhas não coincidem."); return; }
    setLoading(true); setError(""); setSuccess("");
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) { setError(translateError(err.message)); return; }
    // Se confirmação de e-mail estiver desabilitada → entra direto
    if (data?.user?.confirmed_at || data?.session) {
      onAuthenticated(data.user);
    } else {
      setSuccess("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
    }
  }

  /* ── RECUPERAÇÃO DE SENHA ─────────────────────────────────────────────── */
  async function handleReset(e) {
    e.preventDefault();
    if (!email) { setError("Digite seu e-mail."); return; }
    setLoading(true); setError(""); setSuccess("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (err) { setError(translateError(err.message)); return; }
    setSuccess("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
  }

  /* ── INPUT STYLE com focus ────────────────────────────────────────────── */
  function InputField({ icon: Icon, type, value, onChange, placeholder, rightSlot }) {
    const [focused, setFocused] = useState(false);
    return (
      <div style={s.inputWrap}>
        {Icon && (
          <span style={{ ...s.inputIcon, color: focused ? C.neon : C.muted }}>
            <Icon size={16}/>
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...s.input(!!rightSlot),
            borderColor: focused ? C.neon : C.border,
          }}
        />
        {rightSlot}
      </div>
    );
  }

  /* ── RENDER ───────────────────────────────────────────────────────────── */
  return (
    <div style={s.wrap}>
      <div style={s.orb1}/>
      <div style={s.orb2}/>

      <div style={s.card}>

        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoIcon}>
            <Zap size={22} fill="#fff" color="#fff"/>
          </div>
          <span style={s.logoText}>Vácuo Zero</span>
        </div>

        {/* ── MODO: LOGIN ou CADASTRO ── */}
        {mode !== "reset" && (
          <>
            <div style={s.tabs}>
              <button style={s.tab(mode === "login")}   onClick={() => switchMode("login")}>Entrar</button>
              <button style={s.tab(mode === "signup")}  onClick={() => switchMode("signup")}>Criar conta</button>
            </div>

            <h1 style={s.title}>
              {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p style={s.subtitle}>
              {mode === "login"
                ? "Entre para acessar seu painel de vendas."
                : "Comece a recuperar leads em menos de 5 minutos."}
            </p>

            {error   && <div style={s.errorBox}><AlertCircle size={16} style={{flexShrink:0, marginTop:1}}/>{error}</div>}
            {success && <div style={s.successBox}>✓ {success}</div>}

            <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
              <div style={s.field}>
                <label style={s.label}>E-mail</label>
                <InputField
                  icon={Mail} type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div style={s.field}>
                <label style={s.label}>Senha</label>
                <InputField
                  icon={Lock}
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Mínimo 6 caracteres" : "Sua senha"}
                  rightSlot={
                    <button type="button" style={s.eyeBtn} onClick={() => setShowPw(v => !v)}>
                      {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  }
                />
              </div>

              {mode === "signup" && (
                <div style={s.field}>
                  <label style={s.label}>Confirmar senha</label>
                  <InputField
                    icon={Lock}
                    type={showCf ? "text" : "password"}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repita a senha"
                    rightSlot={
                      <button type="button" style={s.eyeBtn} onClick={() => setShowCf(v => !v)}>
                        {showCf ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    }
                  />
                </div>
              )}

              <button type="submit" style={s.btn(loading)} disabled={loading}>
                {loading
                  ? <><Loader2 size={16} style={{animation:"spin 0.7s linear infinite"}}/> Aguarde...</>
                  : mode === "login" ? "Entrar →" : "Criar conta →"
                }
              </button>
            </form>

            {mode === "login" && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={() => switchMode("reset")}
                  style={{ background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: C.muted, textDecoration: "underline", fontFamily: "'Inter', sans-serif" }}
                >
                  Esqueci minha senha
                </button>
              </div>
            )}
          </>
        )}

        {/* ── MODO: RECUPERAÇÃO DE SENHA ── */}
        {mode === "reset" && (
          <>
            <h1 style={s.title}>Recuperar senha</h1>
            <p style={s.subtitle}>
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </p>

            {error   && <div style={s.errorBox}><AlertCircle size={16} style={{flexShrink:0, marginTop:1}}/>{error}</div>}
            {success && <div style={s.successBox}>✓ {success}</div>}

            {!success && (
              <form onSubmit={handleReset}>
                <div style={s.field}>
                  <label style={s.label}>E-mail</label>
                  <InputField
                    icon={Mail} type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
                <button type="submit" style={s.btn(loading)} disabled={loading}>
                  {loading
                    ? <><Loader2 size={16} style={{animation:"spin 0.7s linear infinite"}}/> Enviando...</>
                    : "Enviar link de recuperação →"
                  }
                </button>
              </form>
            )}

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={() => switchMode("login")}
                style={{ background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, color: C.muted, textDecoration: "underline", fontFamily: "'Inter', sans-serif" }}
              >
                ← Voltar para o login
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <p style={s.footer}>
          Seus dados estão protegidos e isolados por conta.
        </p>
      </div>

      {/* Animação spin para o loader */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #5A5D7A; }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
}

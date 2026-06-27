import React, { useState, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const C = {
  bg:"#080A0F", surface:"#0D0F17", card:"#111420", border:"#1A1D2E",
  text:"#E8EAFF", muted:"#5A5D7A", neon:"#4F6EF7",
  neonGlow:"rgba(79,110,247,0.25)", purple:"#7C3AED",
  green:"#00E5A0", red:"#FF4757",
};

/* ── Input sem re-render a cada tecla ─────────────────────────────────── */
function FastInput({ type, placeholder, inputRef, rightSlot, onFocusChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        onFocus={() => { setFocused(true); onFocusChange && onFocusChange(true); }}
        onBlur={() => { setFocused(false); onFocusChange && onFocusChange(false); }}
        style={{
          width:"100%", background:C.surface,
          border:`1px solid ${focused ? C.neon : C.border}`,
          borderRadius:11, padding:`11px 14px 11px 14px`,
          paddingRight: rightSlot ? 42 : 14,
          fontSize:14, color:C.text, outline:"none",
          fontFamily:"'Inter',sans-serif",
          transition:"border-color 0.2s",
          boxSizing:"border-box",
        }}
      />
      {rightSlot && (
        <div style={{ position:"absolute", right:12 }}>{rightSlot}</div>
      )}
    </div>
  );
}

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode]       = useState("login");
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // Refs para leitura direta — evita re-render a cada tecla
  const emailRef   = useRef(null);
  const passwordRef= useRef(null);
  const confirmRef = useRef(null);

  function switchMode(m) {
    setMode(m); setError(""); setSuccess("");
    if (emailRef.current)    emailRef.current.value    = "";
    if (passwordRef.current) passwordRef.current.value = "";
    if (confirmRef.current)  confirmRef.current.value  = "";
  }

  function translateError(msg = "") {
    if (msg.includes("Invalid login credentials"))   return "E-mail ou senha incorretos.";
    if (msg.includes("Email not confirmed"))         return "Confirme seu e-mail antes de entrar.";
    if (msg.includes("User already registered"))     return "Este e-mail já está cadastrado.";
    if (msg.includes("Password should be at least")) return "A senha precisa ter no mínimo 6 caracteres.";
    if (msg.includes("Unable to validate email"))    return "E-mail inválido.";
    if (msg.includes("rate limit"))                  return "Muitas tentativas. Aguarde alguns minutos.";
    return msg || "Erro inesperado. Tente novamente.";
  }

  async function handleLogin(e) {
    e.preventDefault();
    const email    = emailRef.current?.value?.trim() || "";
    const password = passwordRef.current?.value || "";
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    setLoading(true); setError(""); setSuccess("");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(translateError(err.message)); return; }
    onAuthenticated(data.user);
  }

  async function handleSignup(e) {
    e.preventDefault();
    const email    = emailRef.current?.value?.trim() || "";
    const password = passwordRef.current?.value || "";
    const confirm  = confirmRef.current?.value || "";
    if (!email || !password || !confirm) { setError("Preencha todos os campos."); return; }
    if (password.length < 6)             { setError("A senha precisa ter no mínimo 6 caracteres."); return; }
    if (password !== confirm)            { setError("As senhas não coincidem."); return; }
    setLoading(true); setError(""); setSuccess("");
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) { setError(translateError(err.message)); return; }
    if (data?.user?.confirmed_at || data?.session) {
      onAuthenticated(data.user);
    } else {
      setSuccess("Conta criada! Verifique seu e-mail para confirmar.");
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    const email = emailRef.current?.value?.trim() || "";
    if (!email) { setError("Digite seu e-mail."); return; }
    setLoading(true); setError(""); setSuccess("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (err) { setError(translateError(err.message)); return; }
    setSuccess("E-mail de recuperação enviado!");
  }

  const eyeBtn = (show, toggle) => (
    <button type="button" onClick={toggle}
      style={{ background:"none", border:"none", cursor:"pointer", color:C.muted,
        display:"flex", alignItems:"center", padding:4 }}>
      {show ? <EyeOff size={16}/> : <Eye size={16}/>}
    </button>
  );

  return (
    <div style={{
      minHeight:"100dvh", background:C.bg,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"24px 16px", position:"relative", overflow:"hidden",
      fontFamily:"'Inter',sans-serif",
    }}>
      {/* Orbs */}
      <div style={{ position:"absolute", borderRadius:"50%", filter:"blur(100px)",
        width:500, height:500, top:-150, left:-100, pointerEvents:"none",
        background:"radial-gradient(circle, rgba(79,110,247,0.15) 0%, transparent 70%)" }}/>
      <div style={{ position:"absolute", borderRadius:"50%", filter:"blur(100px)",
        width:400, height:400, bottom:-100, right:-80, pointerEvents:"none",
        background:"radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }}/>

      <div style={{ width:"100%", maxWidth:420, position:"relative", zIndex:1,
        background:C.card, border:`1px solid ${C.border}`, borderRadius:24,
        padding:"40px 36px", boxShadow:"0 24px 64px rgba(0,0,0,0.4)" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:32 }}>
          <div style={{ width:44, height:44, borderRadius:12,
            background:`linear-gradient(135deg, ${C.neon}, ${C.purple})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${C.neonGlow}` }}>
            <Zap size={22} fill="#fff" color="#fff"/>
          </div>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:C.text }}>Vácuo Zero</span>
        </div>

        {/* ── LOGIN / CADASTRO ── */}
        {mode !== "reset" && (<>
          {/* Tabs */}
          <div style={{ display:"flex", background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:12, padding:4, marginBottom:28, gap:4 }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={() => switchMode(m)}
                style={{ flex:1, padding:"9px 0", borderRadius:9, border:"none",
                  fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer",
                  background: mode===m ? `linear-gradient(135deg, ${C.neon}, ${C.purple})` : "transparent",
                  color: mode===m ? "#fff" : C.muted,
                  boxShadow: mode===m ? `0 4px 16px ${C.neonGlow}` : "none",
                  transition:"all 0.2s" }}>
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800,
            color:C.text, textAlign:"center", marginBottom:6, letterSpacing:"-0.02em" }}>
            {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p style={{ fontSize:14, color:C.muted, textAlign:"center", marginBottom:28, lineHeight:1.6 }}>
            {mode === "login" ? "Entre para acessar seu painel de vendas." : "Comece a recuperar leads em menos de 5 minutos."}
          </p>

          {error   && (
            <div style={{ background:"rgba(255,71,87,0.08)", border:"1px solid rgba(255,71,87,0.25)",
              borderRadius:10, padding:"11px 14px", display:"flex", alignItems:"flex-start", gap:10,
              marginBottom:18, fontSize:13, color:C.red, lineHeight:1.5 }}>
              <AlertCircle size={16} style={{ flexShrink:0, marginTop:1 }}/>{error}
            </div>
          )}
          {success && (
            <div style={{ background:"rgba(0,229,160,0.08)", border:"1px solid rgba(0,229,160,0.2)",
              borderRadius:10, padding:"11px 14px", marginBottom:18, fontSize:13, color:C.green }}>
              ✓ {success}
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : handleSignup}
            style={{ display:"flex", flexDirection:"column", gap:16 }}>

            <div>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:"block",
                marginBottom:7, letterSpacing:"0.04em", textTransform:"uppercase" }}>E-mail</label>
              <FastInput type="email" placeholder="seu@email.com" inputRef={emailRef}/>
            </div>

            <div>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:"block",
                marginBottom:7, letterSpacing:"0.04em", textTransform:"uppercase" }}>Senha</label>
              <FastInput
                type={showPw ? "text" : "password"}
                placeholder={mode === "signup" ? "Mínimo 6 caracteres" : "Sua senha"}
                inputRef={passwordRef}
                rightSlot={eyeBtn(showPw, () => setShowPw(v => !v))}
              />
            </div>

            {mode === "signup" && (
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:"block",
                  marginBottom:7, letterSpacing:"0.04em", textTransform:"uppercase" }}>Confirmar senha</label>
                <FastInput
                  type={showCf ? "text" : "password"}
                  placeholder="Repita a senha"
                  inputRef={confirmRef}
                  rightSlot={eyeBtn(showCf, () => setShowCf(v => !v))}
                />
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width:"100%", padding:"13px",
                background: loading ? C.muted : `linear-gradient(135deg, ${C.neon}, ${C.purple})`,
                color:"#fff", border:"none", borderRadius:12,
                fontFamily:"'Inter',sans-serif", fontSize:15, fontWeight:700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : `0 8px 24px ${C.neonGlow}`,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                transition:"all 0.15s", marginTop:4 }}>
              {loading
                ? <><Loader2 size={16} style={{ animation:"spin 0.7s linear infinite" }}/> Aguarde...</>
                : mode === "login" ? "Entrar →" : "Criar conta →"
              }
            </button>
          </form>

          {mode === "login" && (
            <div style={{ textAlign:"center", marginTop:16 }}>
              <button onClick={() => switchMode("reset")}
                style={{ background:"none", border:"none", cursor:"pointer",
                  fontSize:13, color:C.muted, textDecoration:"underline",
                  fontFamily:"'Inter',sans-serif" }}>
                Esqueci minha senha
              </button>
            </div>
          )}
        </>)}

        {/* ── RECUPERAÇÃO DE SENHA ── */}
        {mode === "reset" && (<>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800,
            color:C.text, textAlign:"center", marginBottom:8, letterSpacing:"-0.02em" }}>
            Recuperar senha
          </h1>
          <p style={{ fontSize:14, color:C.muted, textAlign:"center", marginBottom:28, lineHeight:1.6 }}>
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>

          {error   && (
            <div style={{ background:"rgba(255,71,87,0.08)", border:"1px solid rgba(255,71,87,0.25)",
              borderRadius:10, padding:"11px 14px", display:"flex", gap:10,
              marginBottom:18, fontSize:13, color:C.red }}>
              <AlertCircle size={16} style={{ flexShrink:0, marginTop:1 }}/>{error}
            </div>
          )}
          {success && (
            <div style={{ background:"rgba(0,229,160,0.08)", border:"1px solid rgba(0,229,160,0.2)",
              borderRadius:10, padding:"11px 14px", marginBottom:18, fontSize:13, color:C.green }}>
              ✓ {success}
            </div>
          )}

          {!success && (
            <form onSubmit={handleReset} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:"block",
                  marginBottom:7, letterSpacing:"0.04em", textTransform:"uppercase" }}>E-mail</label>
                <FastInput type="email" placeholder="seu@email.com" inputRef={emailRef}/>
              </div>
              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"13px",
                  background: loading ? C.muted : `linear-gradient(135deg, ${C.neon}, ${C.purple})`,
                  color:"#fff", border:"none", borderRadius:12,
                  fontFamily:"'Inter',sans-serif", fontSize:15, fontWeight:700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {loading
                  ? <><Loader2 size={16} style={{ animation:"spin 0.7s linear infinite" }}/> Enviando...</>
                  : "Enviar link de recuperação →"
                }
              </button>
            </form>
          )}

          <div style={{ textAlign:"center", marginTop:20 }}>
            <button onClick={() => switchMode("login")}
              style={{ background:"none", border:"none", cursor:"pointer",
                fontSize:13, color:C.muted, textDecoration:"underline",
                fontFamily:"'Inter',sans-serif" }}>
              ← Voltar para o login
            </button>
          </div>
        </>)}

        <p style={{ textAlign:"center", marginTop:24, fontSize:12, color:C.muted, lineHeight:1.7 }}>
          Seus dados estão protegidos e isolados por conta.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #5A5D7A; }
      `}</style>
    </div>
  );
}

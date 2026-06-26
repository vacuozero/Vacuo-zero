import React, { useState, useEffect } from "react";
import {
  Target, Search, MessageSquareText, RotateCcw, X,
  Repeat, TrendingUp, Brain, ChevronDown, ChevronUp,
  Zap, Lock
} from "lucide-react";

/* ═══════════════════════════════════ DESIGN TOKENS (mesmo padrão do App.jsx) */
const C = {
  bg:        "#080A0F",
  surface:   "#0D0F17",
  card:      "#111420",
  border:    "#1A1D2E",
  borderHi:  "#252840",
  text:      "#E8EAFF",
  muted:     "#5A5D7A",
  subtle:    "#2D3050",
  neon:      "#4F6EF7",
  neonGlow:  "rgba(79,110,247,0.25)",
  purple:    "#7C3AED",
  purpleGlow:"rgba(124,58,237,0.2)",
  cyan:      "#00D4FF",
  cyanGlow:  "rgba(0,212,255,0.2)",
  green:     "#00E5A0",
  greenGlow: "rgba(0,229,160,0.2)",
  amber:     "#F59E0B",
  amberGlow: "rgba(245,158,11,0.2)",
  red:       "#FF4757",
  redGlow:   "rgba(255,71,87,0.2)",
  orange:    "#FF6B35",
  orangeGlow:"rgba(255,107,53,0.2)",
};

/* ═══════════════════════════════════ DADOS DOS CARDS */
const CARDS = [
  {
    id: "estudo",
    icon: Search,
    color: C.neon,
    glow: C.neonGlow,
    emoji: "🔍",
    title: "Estudo do Cliente",
    sub: "Antes de qualquer abordagem",
    badge: "Pré-venda",
    situacao: "Você ainda não vendeu, mas quer aumentar a conversão.",
    acoes: [
      "Pesquisar empresa (site / Instagram)",
      "Entender produto e serviço do cliente",
      "Identificar público-alvo",
      "Analisar concorrentes do cliente",
    ],
    evitar: [
      "Abordar sem contexto",
      "Mandar proposta fria sem pesquisa",
    ],
    imediata: "Criar abordagem personalizada com base na pesquisa",
  },
  {
    id: "ativa",
    icon: MessageSquareText,
    color: C.green,
    glow: C.greenGlow,
    emoji: "📲",
    title: "Venda Ativa",
    sub: "Cliente demonstrou interesse",
    badge: "WhatsApp",
    situacao: "Cliente já demonstrou interesse — hora de agir com estratégia.",
    acoes: [
      "Usar mensagem curta e direta",
      "Aplicar gatilho de curiosidade",
      "Fazer follow-up estruturado",
    ],
    estrategias: ["Curiosidade", "Escassez", "Autoridade"],
    evitar: [
      "Textos longos e cansativos",
      "Pressão excessiva no cliente",
    ],
  },
  {
    id: "sumiu",
    icon: RotateCcw,
    color: C.amber,
    glow: C.amberGlow,
    emoji: "🌀",
    title: "Cliente Sumiu",
    sub: "Parou de responder",
    badge: "Recuperação",
    situacao: "Cliente parou de responder. É hora da sequência de reativação.",
    plano: [
      { tempo: "7 dias",  acao: "Reengajamento leve" },
      { tempo: "15 dias", acao: "Mensagem direta" },
      { tempo: "30 dias", acao: "Última tentativa estratégica" },
    ],
    estrategias: ["Curiosidade", "Reativação", "Retomada de conversa"],
  },
  {
    id: "cancelou",
    icon: X,
    color: C.red,
    glow: C.redGlow,
    emoji: "❌",
    title: "Cliente Cancelou",
    sub: "Desistiu ou cancelou",
    badge: "Retenção",
    situacao: "Cliente desistiu. Objetivo: entender o motivo real, sem argumentar.",
    acoes: [
      "Entender motivo real com perguntas",
      "Não argumentar de imediato",
      "Registrar padrão de cancelamento",
    ],
    pergunta: "\"O que faltou para fazermos sentido para você?\"",
  },
  {
    id: "retencao",
    icon: Repeat,
    color: C.cyan,
    glow: C.cyanGlow,
    emoji: "🔄",
    title: "Retenção",
    sub: "Cliente ativo — não deixar esfriar",
    badge: "Pós-venda",
    situacao: "Cliente já comprou. Agora o foco é manter e crescer o relacionamento.",
    plano: [
      { tempo: "7 dias",    acao: "Pós-venda — verificar satisfação" },
      { tempo: "15–30 dias",acao: "Acompanhamento de resultado" },
      { tempo: "Fase 3",    acao: "Recompra e indicação" },
    ],
    imediata: "Evitar que o cliente esfrie após a compra",
  },
  {
    id: "ticket",
    icon: TrendingUp,
    color: C.purple,
    glow: C.purpleGlow,
    emoji: "💰",
    title: "Ticket Médio",
    sub: "Crescer com quem já comprou",
    badge: "Upsell",
    situacao: "Cliente ativo ou em negociação. Hora de aumentar o valor da conta.",
    acoes: [
      "Oferecer upgrade natural e contextualizado",
      "Cross-sell de produto complementar",
      "Pacotes maiores com desconto progressivo",
    ],
    pergunta: "\"O que mais esse cliente precisa para ter mais resultado?\"",
  },
];

/* ═══════════════════════════════════ TOPBAR (padrão do projeto) */
function Topbar({ user, onMenuToggle }) {
  return (
    <header style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"space-between", marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button className="hamburger-btn" onClick={onMenuToggle}
          style={{ background:C.card, border:`1px solid ${C.border}`, color:C.text,
            borderRadius:9, padding:"8px 10px", cursor:"pointer", display:"none",
            alignItems:"center", justifyContent:"center" }}>
          <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
            <rect y="0"    width="17" height="2" rx="1" fill="currentColor"/>
            <rect y="5.5"  width="13" height="2" rx="1" fill="currentColor"/>
            <rect y="11"   width="17" height="2" rx="1" fill="currentColor"/>
          </svg>
        </button>
        <div>
          <h1 className="topbar-title" style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:21,
            fontWeight:800, margin:0, color:C.text }}>Estratégia</h1>
          <p className="topbar-sub" style={{ color:C.muted, fontSize:12.5, margin:"3px 0 0" }}>
            Guia de ação por situação · Vácuo Zero
          </p>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 14px",
        background:`${C.amber}12`, border:`1px solid ${C.amber}30`, borderRadius:100 }}>
        <span style={{ fontSize:10.5, fontWeight:700, color:C.amber }}>💛 OURO</span>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════ CARD ESTRATÉGICO */
function StratCard({ card, isOpen, onToggle }) {
  const Icon = card.icon;
  return (
    <div style={{ borderRadius:16, overflow:"hidden",
      border:`1px solid ${isOpen ? card.color+"60" : C.border}`,
      background:isOpen ? `linear-gradient(135deg, ${card.color}08, ${C.card})` : C.card,
      transition:"all 0.25s ease",
      boxShadow:isOpen ? `0 8px 32px ${card.glow}` : "none" }}>

      {/* Header clicável */}
      <button onClick={onToggle}
        style={{ width:"100%", background:"none", border:"none", cursor:"pointer",
          padding:"18px 20px", display:"flex", alignItems:"center", gap:14, textAlign:"left" }}>
        <div style={{ width:40, height:40, borderRadius:12, background:`${card.color}18`, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:isOpen ? `0 0 16px ${card.glow}` : "none",
          transition:"box-shadow 0.25s" }}>
          <Icon size={18} color={card.color}/>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{card.title}</span>
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:100,
              background:`${card.color}15`, color:card.color, flexShrink:0 }}>{card.badge}</span>
          </div>
          <p style={{ fontSize:12, color:C.muted, margin:0 }}>{card.sub}</p>
        </div>
        <div style={{ color:isOpen ? card.color : C.muted, transition:"color 0.2s", flexShrink:0 }}>
          {isOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </div>
      </button>

      {/* Corpo expandível */}
      {isOpen && (
        <div style={{ padding:"0 20px 20px", borderTop:`1px solid ${card.color}20` }}>
          {/* Situação */}
          <div style={{ marginTop:16, marginBottom:14, padding:"12px 14px",
            background:`${card.color}08`, borderRadius:10,
            borderLeft:`3px solid ${card.color}` }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em",
              color:card.color, margin:"0 0 4px" }}>Situação</p>
            <p style={{ fontSize:13, color:C.muted, margin:0, lineHeight:1.6 }}>{card.situacao}</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {/* O que fazer / Plano */}
            {card.acoes && (
              <div>
                <p style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase",
                  letterSpacing:"0.06em", color:C.muted, margin:"0 0 8px" }}>O que fazer</p>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:6 }}>
                  {card.acoes.map((a, i) => (
                    <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:C.muted, lineHeight:1.4 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:card.color,
                        flexShrink:0, marginTop:5 }}/>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {card.plano && (
              <div>
                <p style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase",
                  letterSpacing:"0.06em", color:C.muted, margin:"0 0 8px" }}>Plano de ação</p>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:7 }}>
                  {card.plano.map((p, i) => (
                    <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:card.color, minWidth:60, flexShrink:0 }}>{p.tempo}</span>
                      <span style={{ color:C.muted, lineHeight:1.4 }}>{p.acao}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Evitar */}
            {card.evitar && (
              <div>
                <p style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase",
                  letterSpacing:"0.06em", color:C.muted, margin:"0 0 8px" }}>Evitar</p>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:6 }}>
                  {card.evitar.map((e, i) => (
                    <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:C.muted, lineHeight:1.4 }}>
                      <span style={{ color:C.red, flexShrink:0, fontSize:12 }}>✕</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Estratégias */}
            {card.estrategias && (
              <div>
                <p style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase",
                  letterSpacing:"0.06em", color:C.muted, margin:"0 0 8px" }}>Estratégias</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {card.estrategias.map((e, i) => (
                    <span key={i} style={{ fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:100,
                      background:`${card.color}15`, color:card.color,
                      border:`1px solid ${card.color}25` }}>{e}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pergunta-chave */}
          {card.pergunta && (
            <div style={{ marginTop:14, padding:"12px 14px", background:C.surface,
              borderRadius:10, border:`1px solid ${C.border}` }}>
              <p style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase",
                letterSpacing:"0.06em", color:C.muted, margin:"0 0 6px" }}>Pergunta-chave</p>
              <p style={{ fontSize:13.5, color:C.text, margin:0, fontStyle:"italic", lineHeight:1.6 }}>{card.pergunta}</p>
            </div>
          )}

          {/* Ação imediata */}
          {card.imediata && (
            <div style={{ marginTop:14, display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
              background:`${card.color}10`, borderRadius:10 }}>
              <Zap size={13} color={card.color}/>
              <span style={{ fontSize:12.5, fontWeight:600, color:card.color }}>{card.imediata}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════ TELA BLOQUEADA (sem plano Ouro) */
function LockedEstrategia({ setScreen, setUser, showToast }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", minHeight:500, padding:"48px 32px" }}>
      <div style={{ maxWidth:340, textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:20, background:`${C.amber}12`,
          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px",
          boxShadow:`0 8px 30px ${C.amberGlow}` }}>
          <Lock size={32} color={C.amber}/>
        </div>
        <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em",
          color:C.amber, fontWeight:700, margin:"0 0 10px" }}>Exclusivo Ouro</p>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22,
          margin:"0 0 12px", color:C.text }}>Dashboard Estratégico</h2>
        <p style={{ color:C.muted, fontSize:13.5, margin:"0 0 28px", lineHeight:1.7 }}>
          Guia de ação por situação de venda — saiba exatamente o que fazer
          em cada etapa da jornada do cliente. Disponível no Plano Ouro.
        </p>
        <button
          onClick={()=>{
            setUser(u=>({...u, plan:"OURO"}));
            showToast("Plano Ouro ativado! 💛","success");
          }}
          style={{ width:"100%", background:`linear-gradient(135deg,${C.amber},${C.orange})`,
            color:"#fff", border:"none", fontWeight:700, fontSize:14,
            padding:"14px", borderRadius:12, cursor:"pointer",
            boxShadow:`0 8px 28px ${C.amberGlow}`, marginBottom:12 }}>
          💛 Ativar Ouro (Demo)
        </button>
        <button onClick={()=>setScreen("dashboard")}
          style={{ background:"none", border:"none", color:C.muted,
            fontSize:13, cursor:"pointer", textDecoration:"underline" }}>
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ TELA PRINCIPAL */
export default function EstrategiaScreen({ user, setScreen, setUser, showToast, onMenuToggle }) {
  const [openId, setOpenId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{ setTimeout(()=>setMounted(true), 100); },[]);

  const isOuro     = user.plan === "OURO" || user.plan === "DIAMANTE";

  function toggle(id) {
    setOpenId(prev => prev === id ? null : id);
  }

  if (!isOuro) {
    return (
      <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
        <LockedEstrategia setScreen={setScreen} setUser={setUser} showToast={showToast}/>
      </div>
    );
  }

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle}/>

      {/* Grid de cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:10,
        opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(20px)",
        transition:"all 0.5s ease" }}>

        {CARDS.map(card => (
          <StratCard
            key={card.id}
            card={card}
            isOpen={openId === card.id}
            onToggle={()=>toggle(card.id)}
          />
        ))}
      </div>

      {/* Regra de Ouro */}
      <div style={{ marginTop:20, padding:"18px 20px",
        background:`linear-gradient(135deg, ${C.purple}08, ${C.card})`,
        border:`1px solid ${C.purple}30`, borderRadius:16,
        display:"flex", alignItems:"flex-start", gap:14,
        opacity:mounted?1:0, transition:"all 0.5s ease 0.2s" }}>
        <div style={{ width:38, height:38, borderRadius:11, background:`${C.purple}18`, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Brain size={17} color={C.purple}/>
        </div>
        <div>
          <p style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase",
            letterSpacing:"0.07em", color:C.purple, margin:"0 0 5px" }}>🧠 Regra de Ouro Vácuo Zero</p>
          <p style={{ fontSize:14, color:C.muted, margin:0, fontStyle:"italic", lineHeight:1.7 }}>
            Quem entende o momento do cliente vende mais do que quem só tenta vender.
          </p>
        </div>
      </div>

      {/* Resultados esperados */}
      <div style={{ marginTop:14, padding:"18px 20px",
        background:C.card, border:`1px solid ${C.border}`, borderRadius:16,
        opacity:mounted?1:0, transition:"all 0.5s ease 0.3s" }}>
        <p style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase",
          letterSpacing:"0.07em", color:C.muted, margin:"0 0 12px" }}>🎯 Resultado Esperado</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px,1fr))", gap:8 }}>
          {[
            { label:"Mais conversões",      color:C.green  },
            { label:"Clientes recuperados", color:C.neon   },
            { label:"Menos oportunidades perdidas", color:C.amber },
            { label:"Ticket médio maior",   color:C.purple },
            { label:"Retenção crescente",   color:C.cyan   },
          ].map((r, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8,
              padding:"9px 12px", borderRadius:10, background:`${r.color}08`,
              border:`1px solid ${r.color}20` }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:r.color, flexShrink:0,
                boxShadow:`0 0 8px ${r.color}` }}/>
              <span style={{ fontSize:12, color:C.muted }}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

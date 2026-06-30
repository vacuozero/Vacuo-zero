import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, MessageSquareText, Repeat, RotateCcw, BookOpen,
  GraduationCap, Lock, Send, Loader2, TrendingUp, ShoppingBag,
  ChevronRight, Crown, Flame, Award, Star, ArrowLeft, Check,
  Sparkles, LogOut, Users, AlertTriangle, DollarSign,
  Plus, Edit3, Trash2, Search, Copy, RefreshCw, Heart,
  X, Clock, CheckCircle, BarChart2, Settings,
  Bell, PieChart, Activity, Zap, Target, TrendingDown, Shield,
  Download, MessageCircle, Info, Trophy, Medal, Gem, ChevronUp, ChevronDown,
  BarChart, FileText, Rocket, TrendingUp as Trend, Calendar, List, AlarmClock
} from "lucide-react";
import { supabase } from "./supabase.js";
import AuthScreen from "./AuthScreen.jsx";
import EstrategiaScreen from "./EstrategiaScreen.jsx";

/* ═══════════════════════════════════ DESIGN TOKENS */
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

/* ═══════════════════════════════════ DATA */

const RANKS = [
  { name:"Iniciante", min:0,    color:C.muted,  emoji:"⭐", icon:Star,     xpNext:500 },
  { name:"Operador",  min:500,  color:"#C77B3F", emoji:"🔥", icon:Flame,    xpNext:1500 },
  { name:"Closer",    min:1500, color:C.cyan,    emoji:"🏆", icon:Award,    xpNext:3500 },
  { name:"Especialista",min:3500,color:C.neon,   emoji:"💎", icon:Gem,      xpNext:7000 },
  { name:"Elite",     min:7000, color:C.amber,   emoji:"👑", icon:Crown,    xpNext:15000 },
  { name:"Black",     min:15000,color:"#1a1a1a", emoji:"⬛", icon:Shield,   xpNext:30000 },
  { name:"Diamante",  min:30000,color:C.cyan,    emoji:"💠", icon:Sparkles, xpNext:null },
];

const ACHIEVEMENTS = [
  { id:"primeiro_lead", name:"Primeiro Lead",    emoji:"🎯", desc:"Cadastrou o primeiro lead",   xp:50  },
  { id:"recuperador",   name:"Recuperador",      emoji:"🔄", desc:"Recuperou 3 leads",           xp:100 },
  { id:"fechador",      name:"Fechador",         emoji:"🔥", desc:"Fechou 5 vendas",             xp:200 },
  { id:"mestre_fup",    name:"Mestre Follow-Up", emoji:"📨", desc:"Criou 10 follow-ups",         xp:150 },
  { id:"elite_closer",  name:"Elite Closer",     emoji:"👑", desc:"Atingiu rank Elite",          xp:300 },
  { id:"streak_7",      name:"7 Dias Seguidos",  emoji:"🔥", desc:"7 dias de acesso consecutivos",xp:100},
  { id:"mil_xp",        name:"1000 XP",          emoji:"⚡", desc:"Acumulou 1000 XP",            xp:50  },
];

const NICHES = [
  { id:"comercio",  label:"Comércio Geral",     icon:ShoppingBag },
  { id:"marketing", label:"Marketing Digital",   icon:TrendingUp },
];
const NICHE_LABEL = { marketing:"Marketing Digital", comercio:"Comércio Geral" };

const OBJECTIONS = {
  marketing:[
    { obj:"Não tenho verba agora",               cat:"Preço" },
    { obj:"Preciso alinhar com meu sócio",       cat:"Decisor" },
    { obj:"Já tentei algo parecido e não rolou", cat:"Ceticismo" },
    { obj:"Vou avaliar com calma",               cat:"Procrastinação" },
    { obj:"Prefiro contratar alguém interno",    cat:"Concorrência" },
    { obj:"Não acredito que funciona pra mim",   cat:"Ceticismo" },
  ],
  comercio:[
    { obj:"Achei mais barato no concorrente",    cat:"Preço" },
    { obj:"Vou dar uma olhada e volto",          cat:"Procrastinação" },
    { obj:"Não preciso disso agora",             cat:"Necessidade" },
    { obj:"Já tenho um produto parecido",        cat:"Concorrência" },
    { obj:"Deixa eu ver com minha esposa",       cat:"Decisor" },
    { obj:"Tô sem dinheiro no momento",          cat:"Preço" },
  ],
};

const TRAININGS = [
  { id:"psico", title:"Psicologia de Vendas",         desc:"Gatilhos mentais que fazem o lead confiar antes de comprar.", xp:100, duration:"8 min", level:"Básico" },
  { id:"obj",   title:"Quebrando Objeções",           desc:"Como ouvir, validar e virar a objeção a favor do fechamento.", xp:150, duration:"12 min", level:"Intermediário" },
  { id:"fech",  title:"Fechamento no WhatsApp",       desc:"Os 3 momentos certos de puxar o fechamento numa conversa.", xp:120, duration:"10 min", level:"Intermediário" },
  { id:"fup",   title:"Follow-Up Sem Parecer Chato",  desc:"Como reaparecer sem ser inconveniente — e fechar no segundo contato.", xp:130, duration:"9 min", level:"Básico" },
  { id:"rec",   title:"Reativando Leads Frios",       desc:"Reativar quem sumiu sem soar desesperado.", xp:140, duration:"11 min", level:"Avançado" },
  { id:"vacu",  title:"Diagnóstico do Vácuo",         desc:"Identifique o momento exato em que o lead esfriou.", xp:160, duration:"14 min", level:"Avançado" },
];



/* ═══════════════════════════════════ WHATSAPP MESSAGE LIBRARY */
const WA_MESSAGES = {
  sumido: [
    (name,prod) => `Oi ${name}! 👋 Tô passando aqui pra ver como você tá. Ainda pensando em ${prod}? Posso tirar qualquer dúvida que ficou.`,
    (name,prod) => `${name}, que saudade! 😄 Você sumiu depois da nossa conversa sobre ${prod}. Aconteceu alguma coisa? Posso ajudar?`,
    (name,prod) => `Oi ${name}! Vi que faz um tempinho que não conversamos. Ainda tem interesse em ${prod}? Me conta como posso te ajudar 🙏`,
  ],
  semResposta: [
    (name,prod) => `${name}, tentei te chamar outras vezes sobre ${prod} mas não consegui retorno. Manda um oi quando puder! 😊`,
    (name,prod) => `Oi ${name}! Última tentativa aqui — se ${prod} ainda fizer sentido pra você, estou disponível. Se não for o momento, tudo bem também 🤝`,
    (name,prod) => `${name}, sei que a vida tá corrida. Se em algum momento quiser retomar a conversa sobre ${prod}, pode me chamar aqui!`,
  ],
  objPreco: [
    (name,prod) => `${name}, entendo que o investimento em ${prod} parece alto agora. Posso te mostrar como o retorno costuma compensar em menos de um mês. Tem 5 minutos?`,
    (name,prod) => `Oi ${name}! Sobre o valor de ${prod} — posso montar uma condição especial só pra você. Posso ligar amanhã de manhã?`,
    (name,prod) => `${name}, você mencionou o preço de ${prod}. E se eu te mostrar que é possível começar com metade? Me conta o que seria viável pra você 🙌`,
  ],
  proposta: [
    (name,prod) => `${name}, a proposta de ${prod} que te enviei ainda está na mesa! Tem alguma dúvida que posso esclarecer?`,
    (name,prod) => `Oi ${name}! Queria saber se conseguiu dar uma olhada na proposta de ${prod}. O que achou?`,
    (name,prod) => `${name}, a proposta de ${prod} vence essa semana. Não quero que você perca a condição especial — me conta o que falta pra fechar 🎯`,
  ],
  cancelamento: [
    (name,prod) => `${name}, fiquei sabendo que você quer cancelar ${prod}. Antes de finalizar, posso fazer algo diferente pra te manter? Me conta o motivo.`,
    (name,prod) => `Oi ${name}. Entendo sua decisão sobre ${prod}. Posso perguntar o que não atendeu suas expectativas? Quero melhorar pra você e pra outros clientes.`,
    (name,prod) => `${name}, se o motivo for financeiro, posso pausar ${prod} por 30 dias sem custo. Vale a pena conversar antes de cancelar? 🤝`,
  ],
  semInteresse: [
    (name,prod) => `${name}, percebo que talvez o momento para ${prod} não seja agora. Posso entender melhor o que mudou?`,
    (name,prod) => `Oi ${name}! Sem pressão, sei que às vezes o timing não é o ideal. Se mudar de ideia sobre ${prod}, estarei aqui 😊`,
    (name,prod) => `${name}, última pergunta rápida — tem algo específico em ${prod} que não te convenceu? Quero entender pra poder ajudar melhor.`,
  ],
};

function getWAMessage(type, lead, idx=0) {
  const msgs = WA_MESSAGES[type];
  if (!msgs) return "";
  const fn = msgs[idx % msgs.length];
  return fn(lead.name.split(" ")[0], lead.product);
}

function getWAType(lead) {
  if (lead.lastContact >= 21) return "semResposta";
  if (lead.lastContact >= 14) return "sumido";
  if ((lead.obs||"").toLowerCase().includes("caro") || (lead.obs||"").toLowerCase().includes("preço")) return "objPreco";
  if ((lead.obs||"").toLowerCase().includes("proposta")) return "proposta";
  if ((lead.obs||"").toLowerCase().includes("cancelar")) return "cancelamento";
  if ((lead.obs||"").toLowerCase().includes("interesse")) return "semInteresse";
  return "sumido";
}

/* ═══════════════════════════════════ FLOW UP / SEQUÊNCIA ANTI-SUMIÇO */
const IA_DISCLAIMER = "\n\n⚠️ Rascunho IA. Revise antes de enviar.";

function buildFlowSequence(name, product, value) {
  const n = name.split(" ")[0];
  return [
    {
      day: "D+0",
      label: "Mensagem Inicial",
      color: C.neon,
      icon: "📩",
      text: `Oi ${n}! 👋 Tudo bem? Passando aqui para retomar nossa conversa sobre ${product}. Você teve chance de pensar a respeito? Posso tirar qualquer dúvida que ficou — à disposição!${IA_DISCLAIMER}`
    },
    {
      day: "D+1",
      label: "Ficou alguma dúvida?",
      color: C.amber,
      icon: "❓",
      text: `${n}, vi que você ainda não respondeu sobre ${product}. Às vezes fica alguma dúvida que trava a decisão. Pode me contar o que ficou faltando? Quero garantir que você tenha todas as informações antes de decidir. 😊${IA_DISCLAIMER}`
    },
    {
      day: "D+3",
      label: "Falou com o sócio?",
      color: C.orange,
      icon: "🤝",
      text: `Oi ${n}! Já tive a chance de falar com seu sócio sobre ${product}? Sei que decisões de investimento (R$${value}) envolvem mais de uma pessoa. Se quiser, posso montar uma apresentação rápida para facilitar essa conversa interna.${IA_DISCLAIMER}`
    },
    {
      day: "D+7",
      label: "Vou arquivar",
      color: C.red,
      icon: "🔴",
      text: `${n}, como não tivemos retorno, vou encerrar nosso contato sobre ${product} por aqui. Não quero incomodar. Se em algum momento fizer sentido retomar — estou aqui! Boa sorte nos seus projetos. 🙏${IA_DISCLAIMER}`
    }
  ];
}

const SEQUENCIAS_PRONTAS = [
  {
    id: "preco",
    label: "🏷️ Objeção: Preço",
    desc: "Lead achou caro ou pediu desconto",
    msgs: [
      { day:"D+0", label:"Entender a objeção",    text:`Oi {nome}! 👋 Entendo que o investimento em {produto} pode parecer alto num primeiro momento. Posso te mostrar como o retorno costuma compensar em menos de 30 dias? Tem 5 minutos?${IA_DISCLAIMER}` },
      { day:"D+1", label:"Mostrar valor",          text:`{nome}, ontem te falei sobre o retorno em {produto}. Clientes parecidos com você recuperaram o investimento em 3 semanas. Posso te mandar um caso real?${IA_DISCLAIMER}` },
      { day:"D+3", label:"Condição especial",      text:`{nome}, acabei de conseguir uma condição especial para {produto} que vence essa semana. Posso te passar os detalhes? Não quero que você perca essa oportunidade. 🎯${IA_DISCLAIMER}` },
      { day:"D+7", label:"Última tentativa",       text:`{nome}, última mensagem sobre {produto} por aqui. Se o valor ainda for um impeditivo, tudo bem — mas se quiser conversar sobre uma forma de encaixar no seu orçamento, estou disponível! 🤝${IA_DISCLAIMER}` },
    ]
  },
  {
    id: "concorrente",
    label: "⚔️ Objeção: Concorrente",
    desc: "Lead comparou com concorrente",
    msgs: [
      { day:"D+0", label:"Validar a comparação",   text:`Oi {nome}! Faz todo sentido comparar opções antes de decidir sobre {produto}. Posso te mostrar 3 diferenças que fazem nossos clientes preferirem a gente? Leva só 2 minutos.${IA_DISCLAIMER}` },
      { day:"D+1", label:"Diferencial concreto",   text:`{nome}, uma coisa que nenhum concorrente oferece em {produto}: [seu principal diferencial]. Isso já mudou a decisão de vários clientes. Vale a pena ver?${IA_DISCLAIMER}` },
      { day:"D+3", label:"Prova social",           text:`{nome}, um cliente que veio do concorrente para o nosso {produto} disse: "Me arrependi de ter esperado tanto." O que faria você tomar essa decisão com mais segurança?${IA_DISCLAIMER}` },
      { day:"D+7", label:"Fechar ou arquivar",     text:`{nome}, preciso saber se ainda faz sentido conversarmos sobre {produto}. Se você fechou com outro fornecedor, tudo bem — só me avisa para eu organizar minha agenda! 😊${IA_DISCLAIMER}` },
    ]
  },
  {
    id: "voupersar",
    label: "🤔 Objeção: Vou Pensar",
    desc: "Lead disse que vai pensar e sumiu",
    msgs: [
      { day:"D+0", label:"Destravando a decisão",  text:`Oi {nome}! Você me disse que ia pensar em {produto}. Sem pressa — mas posso te fazer uma pergunta? O que ainda está faltando para você se sentir seguro para decidir?${IA_DISCLAIMER}` },
      { day:"D+1", label:"Identificar o bloqueio", text:`{nome}, às vezes "vou pensar" esconde uma dúvida que ninguém perguntou. É o preço? É a confiança? É o timing? Me conta — prometo não pressionar.${IA_DISCLAIMER}` },
      { day:"D+3", label:"Criar urgência real",    text:`{nome}, só pra saber: as condições de {produto} que te passei têm validade até [data]. Depois disso muda. Queria te avisar antes para não perder a oportunidade.${IA_DISCLAIMER}` },
      { day:"D+7", label:"Última chamada",         text:`{nome}, encerrando meu acompanhamento sobre {produto} por aqui. Se mudar de ideia — ou quando o momento certo chegar — pode me chamar! 🙏${IA_DISCLAIMER}` },
    ]
  },
  {
    id: "sumiu",
    label: "👻 Sumiço Repentino",
    desc: "Lead sumiu sem dar satisfação",
    msgs: [
      { day:"D+0", label:"Recontato leve",         text:`Oi {nome}! 😄 Que saudade — sumiu depois da nossa conversa sobre {produto}. Aconteceu alguma coisa? Sem compromisso, só queria saber se posso ajudar de alguma forma.${IA_DISCLAIMER}` },
      { day:"D+1", label:"Quebrar o gelo",         text:`{nome}, sei que a vida fica corrida. Sobre {produto} — se quiser, posso mandar um resumo rápido de 2 linhas do que conversamos para refrescar a memória?${IA_DISCLAIMER}` },
      { day:"D+3", label:"Urgência com empatia",   text:`{nome}, estou com uma condição especial para {produto} disponível até essa semana. Não quero que você perca por falta de informação — vale pelo menos saber, né?${IA_DISCLAIMER}` },
      { day:"D+7", label:"Arquivando",             text:`{nome}, vou parar de te incomodar sobre {produto}. Se um dia fizer sentido retomar, estou aqui. Cuida-se! 👊${IA_DISCLAIMER}` },
    ]
  },
  {
    id: "semgrana",
    label: "💸 Sem Dinheiro Agora",
    desc: "Lead disse que não tem verba no momento",
    msgs: [
      { day:"D+0", label:"Validar e sondar",       text:`Oi {nome}! Entendo perfeitamente — às vezes o timing financeiro complica tudo. Posso te fazer uma pergunta? Quando você imagina que esse cenário muda? Quero planejar pra você.${IA_DISCLAIMER}` },
      { day:"D+1", label:"Mostrar flexibilidade",  text:`{nome}, sobre {produto}: posso montar uma condição de entrada reduzida pra você começar agora e expandir depois. Vale pelo menos saber quanto ficaria?${IA_DISCLAIMER}` },
      { day:"D+3", label:"ROI claro",              text:`{nome}, muitos clientes pensavam que não tinham verba para {produto} — mas quando viram que o retorno vem em 30 dias, mudaram de ideia. Posso te mandar os números?${IA_DISCLAIMER}` },
      { day:"D+7", label:"Agendamento futuro",     text:`{nome}, tudo bem! Posso registrar aqui para entrar em contato quando você estiver em momento melhor para {produto}? Quando seria uma boa época — daqui 30 dias, 60 dias?${IA_DISCLAIMER}` },
    ]
  },
  {
    id: "propostatravada",
    label: "📋 Proposta Travada",
    desc: "Lead recebeu proposta mas não respondeu",
    msgs: [
      { day:"D+0", label:"Chegar na proposta",     text:`Oi {nome}! 👋 A proposta de {produto} que te enviei ainda está na sua caixa de entrada. Teve chance de dar uma olhada? Posso esclarecer qualquer ponto antes que vença.${IA_DISCLAIMER}` },
      { day:"D+1", label:"Identificar travamento", text:`{nome}, às vezes uma proposta trava porque algum ponto ficou confuso. Tem algo específico em {produto} que posso detalhar melhor pra você?${IA_DISCLAIMER}` },
      { day:"D+3", label:"Urgência de validade",   text:`{nome}, a proposta de {produto} vence em [data]. Não quero que você perca as condições especiais. O que falta pra você dar o próximo passo? 🎯${IA_DISCLAIMER}` },
      { day:"D+7", label:"Proposta final",         text:`{nome}, última chamada para a proposta de {produto}. Depois disso os valores precisam ser revistos. Posso reservar mais um tempinho pra você — o que acha?${IA_DISCLAIMER}` },
    ]
  },
  {
    id: "cancelamento",
    label: "🚫 Risco de Cancelamento",
    desc: "Cliente sinalizou que quer cancelar",
    msgs: [
      { day:"D+0", label:"Entender o motivo",      text:`Oi {nome}! Fiquei sabendo que você está pensando em cancelar {produto}. Antes de tudo — posso perguntar o que aconteceu? Quero entender se podemos resolver juntos.${IA_DISCLAIMER}` },
      { day:"D+1", label:"Oferecer solução",       text:`{nome}, com base no que você me contou, acho que posso resolver. E se pausássemos {produto} por 30 dias sem custo enquanto ajustamos? Antes de fechar definitivamente, vale tentar.${IA_DISCLAIMER}` },
      { day:"D+3", label:"Mostrar perda",          text:`{nome}, se cancelar {produto} agora, você perde [benefício principal que o cliente usa]. Tenho certeza que isso vai fazer falta. Posso montar uma solução sob medida pra você?${IA_DISCLAIMER}` },
      { day:"D+7", label:"Última tentativa real",  text:`{nome}, se decidiu mesmo cancelar, entendo e respeito. Mas posso te pedir uma coisa? Me conta o motivo real — vai me ajudar a melhorar para outros clientes. Valeu! 🙏${IA_DISCLAIMER}` },
    ]
  },
  {
    id: "reativacao",
    label: "🔄 Reativação Fria",
    desc: "Lead antigo que esfriou completamente",
    msgs: [
      { day:"D+0", label:"Reativar com gancho",    text:`Oi {nome}! Quanto tempo! 😄 Sei que faz um tempão que não conversamos sobre {produto}. Apareceu algo novo aqui que talvez mude tudo pra você — posso te mostrar?${IA_DISCLAIMER}` },
      { day:"D+1", label:"Conteúdo de valor",      text:`{nome}, ontem te falei sobre a novidade em {produto}. Mandei um conteúdo rápido (abaixo) que resolve exatamente o problema que você tinha antes. Vale 2 minutos.${IA_DISCLAIMER}` },
      { day:"D+3", label:"Convite direto",         text:`{nome}, o que acha de uma conversa rápida de 15 minutos sobre {produto}? Sem compromisso — só pra ver se faz sentido retomarmos. Quando você tem uma janela essa semana?${IA_DISCLAIMER}` },
      { day:"D+7", label:"Encerrar com estilo",    text:`{nome}, não vou mais te incomodar sobre {produto}. Mas sabia que você foi um dos leads que eu mais gostei de conversar? Se um dia quiser retomar — pode chamar sempre! 👊${IA_DISCLAIMER}` },
    ]
  },
  {
    id: "socio",
    label: "👥 Aguardando Sócio/Decisor",
    desc: "Lead precisa consultar outra pessoa",
    msgs: [
      { day:"D+0", label:"Facilitar a conversa",   text:`Oi {nome}! Sobre {produto} — posso preparar um material resumido para você apresentar ao seu sócio? Facilita muito quando a proposta chega de forma clara e visual.${IA_DISCLAIMER}` },
      { day:"D+1", label:"Oferecer reunião 3-way", text:`{nome}, se quiser, posso fazer uma chamada rápida com você e seu sócio juntos sobre {produto}. Tira as dúvidas de uma vez e agiliza a decisão. O que acha?${IA_DISCLAIMER}` },
      { day:"D+3", label:"Criar urgência",         text:`{nome}, já teve a chance de apresentar {produto} para seu sócio? As condições especiais que te passei vencem essa semana — não quero que vocês percam.${IA_DISCLAIMER}` },
      { day:"D+7", label:"Decisão final",          text:`{nome}, vou precisar de uma posição sobre {produto} até [data]. Posso saber se vocês tiveram a chance de conversar? Não quero ficar em aberto sem resposta. Obrigado! 🙏${IA_DISCLAIMER}` },
    ]
  },
  {
    id: "timing",
    label: "⏰ Timing Errado",
    desc: "Lead disse que não é o momento certo",
    msgs: [
      { day:"D+0", label:"Respeitar e sondar",     text:`Oi {nome}! Entendo — às vezes o timing mesmo não é o ideal. Posso te perguntar: quando você imagina que seria um bom momento para retomar {produto}? Anoto aqui pra entrar em contato na hora certa.${IA_DISCLAIMER}` },
      { day:"D+1", label:"Manter aquecido",        text:`{nome}, enquanto o timing não chega, posso te mandar conteúdos sobre {produto} de vez em quando? Assim você chega na hora certa já bem informado.${IA_DISCLAIMER}` },
      { day:"D+3", label:"Mudança de cenário",     text:`{nome}, e se {produto} pudesse começar de um jeito menor, com menos compromisso, até o momento ideal chegar? Às vezes a entrada certa muda o timing inteiro.${IA_DISCLAIMER}` },
      { day:"D+7", label:"Agendamento futuro",     text:`{nome}, vou agendar na minha agenda para entrar em contato em [data que você indicou]. Mas se o timing mudar antes, pode me chamar! Estarei aqui. 😊${IA_DISCLAIMER}` },
    ]
  },
];

/* ═══════════════════════════════════ HELPERS */

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getRank(xp) {
  let current = RANKS[0], next = RANKS[1];
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) { current = RANKS[i]; next = RANKS[i+1] || null; }
  }
  return { current, next };
}

function getVC(days) {
  if (days <= 3)  return { label:"Ativo",     color:C.green, bg:`rgba(0,229,160,0.1)`,  icon:"✅" };
  if (days <= 7)  return { label:"Atenção",   color:C.amber, bg:`rgba(245,158,11,0.1)`, icon:"⚠️" };
  if (days <= 14) return { label:"Esfriando", color:C.orange,bg:`rgba(255,107,53,0.1)`, icon:"🔥" };
  return                   { label:"Em Risco", color:C.red,   bg:`rgba(255,71,87,0.1)`,  icon:"🔴" };
}

function storageKey(uid) { return `vz_data_${uid}`; }
function onbKey(uid)     { return `vz_onb_${uid}`; }
function saveUser(u, uid) {
  if (!uid) return;
  try { localStorage.setItem(storageKey(uid), JSON.stringify(u)); } catch {}
}
function loadUser(uid) {
  if (!uid) return null;
  try { const r = localStorage.getItem(storageKey(uid)); return r ? JSON.parse(r) : null; } catch { return null; }
}

function exportLeadsCSV(leads) {
  const header = ["Nome","Telefone","Produto","Valor (R$)","Dias sem contato","Status","Vácuo (%)","Observações"];
  const rows = leads.map(l => [l.name,l.phone,l.product,l.value,l.lastContact,l.status,l.vacuum,l.obs||""].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(","));
  const csv = [header.join(","),...rows].join("\n");
  const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download="leads_vacuo_zero.csv"; a.click();
  URL.revokeObjectURL(url);
}

function openWhatsApp(phone, message) {
  const num = phone.replace(/\D/g,"");
  window.open(`https://wa.me/55${num}?text=${encodeURIComponent(message)}`,"_blank");
}

/* ═══════════════════════════════════ WHATSAPP SHIELD — COUNTER */
const WA_DAILY_LIMIT = 20;
const WA_SEND_KEY = "vz_wa_send_count";

function getWASendCount(userId) {
  try {
    const raw = localStorage.getItem(WA_SEND_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const today = getTodayStr();
    const key = `${userId}_${today}`;
    return data[key] || 0;
  } catch { return 0; }
}

function incrementWASend(userId) {
  try {
    const raw = localStorage.getItem(WA_SEND_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const today = getTodayStr();
    const key = `${userId}_${today}`;
    data[key] = (data[key] || 0) + 1;
    Object.keys(data).forEach(k => { if (!k.endsWith(today)) delete data[k]; });
    localStorage.setItem(WA_SEND_KEY, JSON.stringify(data));
    return data[key];
  } catch { return 1; }
}

function canSendWA(userId) {
  return getWASendCount(userId) < WA_DAILY_LIMIT;
}

/* ═══════════════════════════════════ WHATSAPP SHIELD — COUNTER */
const AI_USAGE_KEY = "vz_ia_diamante_usage";
const AI_DAILY_LIMIT = 50;

function getAIUsage(userId) {
  try {
    const raw = localStorage.getItem(AI_USAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const today = getTodayStr();
    const key = `${userId}_${today}`;
    return data[key] || 0;
  } catch { return 0; }
}

function incrementAIUsage(userId) {
  try {
    const raw = localStorage.getItem(AI_USAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const today = getTodayStr();
    const key = `${userId}_${today}`;
    data[key] = (data[key] || 0) + 1;
    // Limpar datas antigas (manter só hoje)
    Object.keys(data).forEach(k => { if (!k.endsWith(today)) delete data[k]; });
    localStorage.setItem(AI_USAGE_KEY, JSON.stringify(data));
    return data[key];
  } catch { return 1; }
}

function canUseAI(userId) {
  return getAIUsage(userId) < AI_DAILY_LIMIT;
}

/* IA real com Groq — apenas Closer IA (Diamante) */
async function callGroqIA(system, messages) {
  try {
    const groqMessages = [
      { role: "user", content: `${system}\n\n---\n${messages.map(m => `${m.role === "user" ? "Usuário" : "Assistente"}: ${m.content}`).join("\n")}` }
    ];
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        messages: groqMessages
      })
    });
    if (!res.ok) { const e = await res.json().catch(()=>({})); return `Erro: ${e?.error?.message||"HTTP "+res.status}`; }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "Não consegui gerar. Tente novamente.";
  } catch (e) { return "Erro de conexão. Verifique sua internet."; }
}

/* IA simulada premium — Recuperação, Estratégia (Ouro e Diamante) */
async function callIA(system, messages) {
  // Pequeno delay para simular processamento
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
  const userMsg = messages[messages.length - 1]?.content || "";
  // Extrair informações do lead da mensagem
  const nameMatch = userMsg.match(/(?:Nome:|Lead:)\s*([^.]+)/i);
  const productMatch = userMsg.match(/Produto:\s*([^.]+)/i);
  const daysMatch = userMsg.match(/Dias?\s*sem\s*(?:contato|resposta):\s*(\d+)/i);
  const obsMatch = userMsg.match(/(?:Obs:|Situação:)\s*([^.]+)/i);
  const nome = nameMatch ? nameMatch[1].trim().split(" ")[0] : "cliente";
  const produto = productMatch ? productMatch[1].trim() : "o serviço";
  const dias = daysMatch ? parseInt(daysMatch[1]) : 7;
  const obs = obsMatch ? obsMatch[1].trim().toLowerCase() : "";

  // Detectar contexto pelo system prompt
  const isStrategy = system.includes("Estratégia") || system.includes("estratégia") || system.includes("ESTRATEGIA");
  const isRecovery = system.includes("Recovery") || system.includes("MENSAGEM:");

  if (isRecovery) {
    const variants = [
      { msg: `Oi ${nome}! 👋 Passando rapidinho aqui pra ver se ficou alguma dúvida sobre ${produto}. Às vezes a gente esquece de responder mesmo com interesse, né? Me conta o que achou!`, fup: `${nome}, sei que a vida tá corrida! 😄 Só queria deixar em aberto: se quiser retomar a conversa sobre ${produto}, to aqui. Sem compromisso.`, strat: `Aborde com leveza, sem cobrar. Relembre o benefício principal do produto. Ofereça uma condição especial como gatilho de urgência.` },
      { msg: `${nome}, boa tarde! Tô aqui porque vi que faz ${dias} dias que não conversamos sobre ${produto}. Aconteceu alguma coisa? Posso ajudar com algo? 🙏`, fup: `Oi ${nome}! Última tentativa aqui — se o momento não for ideal agora pra ${produto}, sem problema. Me avisa quando quiser e retomamos! 😊`, strat: `Use empatia para entender o que mudou. Valide a situação do lead. Ofereça flexibilidade na forma de pagamento ou prazo.` },
      { msg: `${nome}! 😊 Queria checar se você tinha chegado a uma conclusão sobre ${produto}. Muita gente que hesita no início acaba ficando super satisfeita depois. Posso esclarecer mais alguma coisa?`, fup: `${nome}, vou deixar o contato aberto. Quando quiser conversar sobre ${produto} é só chamar — estarei aqui! 🤝`, strat: `Cite casos de sucesso de outros clientes parecidos. Mostre provas sociais. Crie senso de oportunidade limitada.` },
    ];
    const v = variants[Math.floor(Math.random() * variants.length)];
    return `MENSAGEM: ${v.msg}\nFOLLOWUP: ${v.fup}\nESTRATEGIA: ${v.strat}`;
  }

  if (isStrategy) {
    const diagnoses = [
      `O lead esfriou porque sentiu falta de urgência na proposta — sem prazo definido, a decisão ficou para "depois".`,
      `Muito provavelmente houve uma objeção interna não verbalizada. ${nome} pode ter comparado com concorrentes ou aguardado uma situação financeira melhor.`,
      `O lead perdeu o momentum. Após ${dias} dias sem contato, a dor original que motivou o interesse em ${produto} pode ter sido esquecida ou contornada de outra forma.`,
    ];
    const approaches = [
      `1. Retome o contato com uma pergunta aberta e sem pressão\n2. Reforce o problema que ${produto} resolve com um exemplo prático\n3. Crie urgência real: disponibilidade limitada, condição especial por tempo determinado`,
      `1. Identifique a objeção real com uma pergunta direta: "O que ficou faltando pra você dar o próximo passo?"\n2. Valide a resposta antes de contra-argumentar\n3. Proponha um compromisso pequeno (demonstração, teste, parcela menor) para reengajar`,
      `1. Envie algo de valor primeiro: dica, conteúdo, resultado de cliente parecido\n2. Depois da abertura, reintroduza ${produto} naturalmente\n3. Feche com uma proposta irresistível de baixo risco para o cliente`,
    ];
    const closes = [
      `"${nome}, se eu conseguir resolver [principal objeção dele], você teria como dar uma resposta essa semana?"`,
      `"O que você precisaria ver ou saber pra tomar essa decisão com segurança?"`,
      `"Imagina daqui a 30 dias com ${produto} funcionando — o que teria mudado no seu dia a dia?"`,
    ];
    const ri = Math.floor(Math.random() * diagnoses.length);
    return `1. DIAGNÓSTICO: ${diagnoses[ri]}\n2. ABORDAGEM: ${approaches[ri]}\n3. SCRIPT DE FECHAMENTO: ${closes[ri]}`;
  }

  // Resposta genérica
  return `Entendido! Com base nas informações de ${nome} sobre ${produto}, a abordagem mais eficaz agora é retomar o contato com empatia, sem pressão, destacando o valor principal do que você oferece. Personalize a mensagem mostrando que você lembra dos detalhes da conversa anterior.`;
}

function clip(text, cb) { navigator.clipboard.writeText(text).then(()=>cb&&cb()); }

/* ═══════════════════════════════════ GLASS CARD */
function GlassCard({ children, style={}, onClick, glow, noPad }) {
  const glowColor = glow === "neon" ? C.neonGlow : glow === "purple" ? C.purpleGlow : glow === "cyan" ? C.cyanGlow : glow === "green" ? C.greenGlow : glow === "amber" ? C.amberGlow : glow === "red" ? C.redGlow : "transparent";
  return (
    <div onClick={onClick}
      style={{
        background:`linear-gradient(135deg, rgba(17,20,32,0.95) 0%, rgba(13,15,23,0.9) 100%)`,
        border:`1px solid ${C.border}`,
        borderRadius:16,
        backdropFilter:"blur(20px)",
        boxShadow:`0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.02)${glow?`, 0 8px 32px ${glowColor}`:""}`,
        padding: noPad ? 0 : "20px 24px",
        transition:"all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════ TOAST */
function Toast({ msg, type="info", onClose }) {
  const colors = { success:C.green, error:C.red, info:C.neon, warning:C.amber };
  useEffect(()=>{ const t=setTimeout(onClose,3200); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:10010,
      background:C.card, border:`1px solid ${colors[type]||C.neon}`,
      borderRadius:12, padding:"12px 20px", display:"flex", alignItems:"center", gap:10,
      boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${colors[type]||C.neon}30`,
      animation:"toastSlide 0.3s ease", fontSize:13.5, fontWeight:500, color:C.text, whiteSpace:"nowrap" }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:colors[type]||C.neon, boxShadow:`0 0 8px ${colors[type]||C.neon}`, flexShrink:0 }}/>
      {msg}
      <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", marginLeft:4, display:"flex" }}><X size={14}/></button>
    </div>
  );
}

/* ═══════════════════════════════════ XP POP */
function XPPop({ amount, onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,1800); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:"fixed", top:80, right:24, zIndex:10009, pointerEvents:"none",
      animation:"xpFly 1.8s ease forwards", fontSize:15, fontWeight:800,
      color:C.amber, textShadow:`0 0 12px ${C.amber}`,
      display:"flex", alignItems:"center", gap:6 }}>
      <Zap size={16} fill={C.amber}/> +{amount} XP
    </div>
  );
}

/* ═══════════════════════════════════ RANK UP MODAL */
function RankUpModal({ rank, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex",
      alignItems:"center", justifyContent:"center", zIndex:10008, padding:20 }}>
      <div style={{ textAlign:"center", animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ fontSize:80, marginBottom:16, filter:`drop-shadow(0 0 30px ${rank.color})` }}>{rank.emoji}</div>
        <p style={{ color:C.muted, fontSize:13, margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.1em" }}>NOVO RANK DESBLOQUEADO</p>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:36, fontWeight:800, color:rank.color, margin:"0 0 24px",
          textShadow:`0 0 40px ${rank.color}` }}>{rank.name}</h2>
        <button onClick={onClose}
          style={{ background:`linear-gradient(135deg, ${rank.color}, ${C.neon})`, color:"#fff", border:"none",
            fontWeight:700, fontSize:14, padding:"14px 32px", borderRadius:100, cursor:"pointer",
            boxShadow:`0 8px 30px ${rank.color}50` }}>
          Continuar 🚀
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ ALERT BADGE */
function AlertBadge({ type }) {
  const map = {
    hot:    { label:"Recuperação Urgente", color:C.red,    icon:"🔴", glow:C.redGlow },
    warn:   { label:"Atenção",             color:C.amber,  icon:"⚠️",  glow:C.amberGlow },
    ready:  { label:"Pronto para Fechar",  color:C.green,  icon:"🟢", glow:C.greenGlow },
    cold:   { label:"Lead Esfriando",      color:C.orange, icon:"🔥", glow:C.orangeGlow },
  };
  const a = map[type] || map.warn;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:100,
      background:`rgba(${a.color.slice(1).match(/.{2}/g).map(x=>parseInt(x,16)).join(",")},0.12)`,
      color:a.color, fontSize:11, fontWeight:700, border:`1px solid ${a.color}35`,
      boxShadow:`0 0 12px ${a.glow}` }}>
      {a.icon} {a.label}
    </span>
  );
}

/* ═══════════════════════════════════ SKELETON */
function Skeleton({ w="100%", h=16, r=8 }) {
  return <div style={{ width:w, height:h, borderRadius:r, background:`linear-gradient(90deg, ${C.card} 25%, ${C.surface} 50%, ${C.card} 75%)`,
    backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite" }}/>;
}

/* ═══════════════════════════════════ VACUUM GAUGE */
function VacuumGauge({ value, size=100 }) {
  const r = (size / 2) - 12;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? C.red : pct >= 40 ? C.orange : pct >= 20 ? C.amber : C.green;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={8}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 0.8s ease, stroke 0.4s ease", filter:`drop-shadow(0 0 6px ${color})` }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"monospace", fontSize:size*0.18, fontWeight:800, color, lineHeight:1 }}>{pct}%</span>
        <span style={{ fontSize:size*0.1, color:C.muted, marginTop:2 }}>vácuo</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ XP BAR IN SIDEBAR */
function SidebarXPBar({ user }) {
  const { current, next } = getRank(user.xp);
  const pct = next ? Math.min(100, ((user.xp - current.min) / (next.min - current.min)) * 100) : 100;
  return (
    <div style={{ padding:"14px 16px", borderTop:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:11, fontWeight:700, color:current.color }}>{current.emoji} {current.name}</span>
        <span style={{ fontSize:10, color:C.muted, fontFamily:"monospace" }}>{user.xp} XP</span>
      </div>
      <div style={{ height:4, background:C.subtle, borderRadius:100, overflow:"hidden" }}>
        <div style={{ height:"100%", background:`linear-gradient(90deg, ${current.color}, ${C.neon})`, width:`${pct}%`,
          transition:"width 0.7s ease", borderRadius:100, boxShadow:`0 0 8px ${current.color}60` }}/>
      </div>
      {next && <div style={{ fontSize:9.5, color:C.muted, marginTop:5 }}>Faltam {next.min - user.xp} XP → {next.emoji} {next.name}</div>}
    </div>
  );
}

/* ═══════════════════════════════════ SIDEBAR */
const NAV_ITEMS = [
  { id:"dashboard",    label:"Dashboard",     icon:LayoutDashboard,   plan:"all" },
  { id:"crm",          label:"CRM",           icon:Users,             plan:"all" },
  { id:"recuperacao",  label:"Recuperação",   icon:RotateCcw,         plan:"all" },
  { id:"estrategia",   label:"Estratégia",    icon:Target,            plan:"OURO" },
  { id:"closer",       label:"Closer IA",     icon:MessageSquareText, plan:"DIAMANTE" },
  { id:"posVenda",     label:"Pós-venda",     icon:Heart,             plan:"all" },
  { id:"gamificacao",  label:"Gamificação",   icon:Trophy,            plan:"all" },
  { id:"treinamentos", label:"Treinamentos",  icon:GraduationCap,     plan:"all" },
  { id:"relatorios",   label:"Relatórios",    icon:BarChart2,         plan:"DIAMANTE" },
  { id:"config",       label:"Configurações", icon:Settings,          plan:"all" },
];

function Sidebar({ screen, setScreen, user, onLogout, isOpen, onClose }) {
  const isDiamante = user.plan === "DIAMANTE";
  function handleNav(id, locked) {
    if (locked) { setScreen("locked:"+id); }
    else setScreen(id);
    onClose && onClose();
  }
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:200,
        opacity:isOpen?1:0, pointerEvents:isOpen?"auto":"none", transition:"opacity 0.25s", backdropFilter:"blur(4px)" }}/>
      <aside className="sidebar-panel" style={{ width:220, flexShrink:0, background:C.surface,
        borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", minHeight:"100%" }}>
        {/* Logo */}
        <div style={{ padding:"20px 18px 16px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:`linear-gradient(135deg, ${C.neon}, ${C.purple})`,
              display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 14px ${C.neonGlow}` }}>
              <Zap size={16} fill="#fff" color="#fff"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:13, letterSpacing:"0.05em", color:C.text }}>VÁCUO ZERO</div>
              <div style={{ fontSize:9.5, color:C.muted, marginTop:1 }}>Sales Intelligence Platform</div>
            </div>
            <button className="sidebar-close-btn" onClick={onClose}
              style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", display:"none" }}>
              <X size={16}/>
            </button>
          </div>
          <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:7, padding:"7px 11px",
            background:isDiamante?"rgba(0,212,255,0.06)":"rgba(79,110,247,0.06)",
            border:`1px solid ${isDiamante?C.cyan+"40":C.neon+"30"}`, borderRadius:9 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:isDiamante?C.cyan:C.neon,
              boxShadow:`0 0 8px ${isDiamante?C.cyan:C.neon}`, flexShrink:0, animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:10.5, fontWeight:700, color:isDiamante?C.cyan:C.neon }}>
              {isDiamante ? "💠 DIAMANTE" : "💛 OURO"}
            </span>
          </div>
        </div>
        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 10px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
          {NAV_ITEMS.map(it => {
            const locked = it.plan === "DIAMANTE" && !isDiamante;
            const active = screen === it.id || screen === "locked:"+it.id;
            const Icon = it.icon;
            return (
              <button key={it.id} onClick={()=>handleNav(it.id, locked)}
                style={{ display:"flex", alignItems:"center", gap:10, width:"100%",
                  background:active ? `linear-gradient(90deg, ${C.neon}18, transparent)` : "transparent",
                  border:"none", borderLeft:`2px solid ${active?C.neon:"transparent"}`,
                  color:active?C.neon:locked?C.subtle:C.muted,
                  padding:"10px 10px 10px 12px", borderRadius:"0 10px 10px 0",
                  fontSize:13, fontWeight:active?700:500, textAlign:"left",
                  cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e=>{ if(!active){e.currentTarget.style.background=`${C.card}80`; e.currentTarget.style.color=C.text;}}}
                onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent"; e.currentTarget.style.color=locked?C.subtle:C.muted;}}}>
                <Icon size={15}/>
                <span style={{ flex:1 }}>{it.label}</span>
                {locked && <Lock size={11} color={C.amber} style={{ opacity:0.6 }}/>}
              </button>
            );
          })}
        </nav>
        <SidebarXPBar user={user}/>
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg, ${C.neon}40, ${C.purple}40)`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.neon }}>
            {user.name[0].toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
            <div style={{ fontSize:10, color:C.muted }}>{NICHE_LABEL[user.niche]}</div>
          </div>
          <button onClick={onLogout} title="Sair"
            style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", display:"flex", padding:4 }}>
            <LogOut size={14}/>
          </button>
        </div>
      </aside>
    </>
  );
}

/* ═══════════════════════════════════ TOPBAR */
function Topbar({ user, title, sub, onMenuToggle, actions, waCount }) {
  const { current } = getRank(user.xp);
  const remaining = WA_DAILY_LIMIT - (waCount || 0);
  const counterColor = remaining <= 0 ? C.red : remaining <= 5 ? C.red : remaining <= 10 ? C.amber : C.green;
  return (
    <header style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"space-between", marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button className="hamburger-btn" onClick={onMenuToggle}
          style={{ background:C.card, border:`1px solid ${C.border}`, color:C.text,
            borderRadius:9, padding:"8px 10px", cursor:"pointer", display:"none", alignItems:"center", justifyContent:"center" }}>
          <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
            <rect y="0"  width="17" height="2" rx="1" fill="currentColor"/>
            <rect y="5.5" width="13" height="2" rx="1" fill="currentColor"/>
            <rect y="11" width="17" height="2" rx="1" fill="currentColor"/>
          </svg>
        </button>
        <div>
          <h1 className="topbar-title" style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:21, fontWeight:800, margin:0, color:C.text }}>{title||`Olá, ${user.name} 👋`}</h1>
          <p className="topbar-sub" style={{ color:C.muted, fontSize:12.5, margin:"3px 0 0" }}>{sub||NICHE_LABEL[user.niche]+" · "+new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</p>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {actions}
        {waCount !== undefined && (
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:100,
            background:`${counterColor}12`, color:counterColor, fontWeight:700, fontSize:11.5,
            border:`1px solid ${counterColor}35`, flexShrink:0, boxShadow:`0 0 12px ${counterColor}20` }}>
            <Shield size={12}/>
            <span style={{ fontFamily:"monospace" }}>{remaining}/{WA_DAILY_LIMIT}</span>
            <span style={{ fontSize:10, opacity:0.8, display:"none" }} className="ia-counter-label">envios</span>
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 13px", borderRadius:100,
          background:`${current.color}15`, color:current.color, fontWeight:700, fontSize:11.5,
          border:`1px solid ${current.color}35`, flexShrink:0, boxShadow:`0 0 16px ${current.color}20` }}>
          {current.emoji} {current.name}
          <span style={{ fontFamily:"monospace", opacity:0.7, fontSize:10.5 }}>⚡{user.xp}</span>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════ MINI CHART (SVG sparkline) */
function Sparkline({ data, color, h=40 }) {
  if (!data || data.length < 2) return null;
  const w = 120;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*(h-6)+3}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow:"visible" }}>
      <defs>
        <linearGradient id={`sg${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
          <stop offset="100%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg${color.slice(1)})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
        style={{ filter:`drop-shadow(0 0 4px ${color})` }}/>
    </svg>
  );
}

/* ═══════════════════════════════════ METRIC CARD */
function MetricCard({ label, value, icon:Icon, color, sub, trend, sparkData, onClick, loading }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ textAlign:"left", width:"100%",
        background:hovered?`linear-gradient(135deg, ${color}08, ${C.card} 60%)` : `linear-gradient(135deg, ${C.card} 0%, ${C.surface} 100%)`,
        border:`1px solid ${hovered?color+"50":C.border}`,
        borderRadius:16, padding:"20px 22px",
        cursor:onClick?"pointer":"default",
        transition:"all 0.25s ease",
        boxShadow:hovered?`0 8px 32px ${color}20, inset 0 1px 0 rgba(255,255,255,0.04)`:`inset 0 1px 0 rgba(255,255,255,0.03)`,
        transform:hovered?"translateY(-2px)":"translateY(0)" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`${color}18`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 0 12px ${color}20` }}>
              <Icon size={15} color={color}/>
            </div>
            <span style={{ fontSize:11, color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</span>
          </div>
          {loading ? <Skeleton h={28} w={80}/> :
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:800, color:C.text, lineHeight:1 }}>{value}</div>
          }
          {sub && <div style={{ fontSize:11.5, color:C.muted, marginTop:6 }}>{sub}</div>}
          {trend && (
            <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:8, fontSize:11.5, fontWeight:600,
              color:trend>0?C.green:C.red }}>
              {trend>0?<TrendingUp size={12}/>:<TrendingDown size={12}/>}
              {trend>0?"+":""}{trend}% vs mês anterior
            </div>
          )}
        </div>
        {sparkData && <Sparkline data={sparkData} color={color}/>}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════ DASHBOARD */
function DashboardScreen({ user, setScreen, setUser, showToast, onXP, onMenuToggle }) {
  const leads = user.leads || [];
  const atRisk     = leads.filter(l=>l.lastContact>=8).length;
  const recovered  = leads.filter(l=>l.status==="Ativo").length;
  const inRisk     = leads.filter(l=>l.status==="Em Risco").length;
  const totalVal   = leads.filter(l=>l.status==="Ativo").reduce((s,l)=>s+l.value,0);
  const recRate    = leads.length ? Math.round((recovered/leads.length)*100) : 0;
  const avgVacuum  = leads.length ? Math.round(leads.reduce((s,l)=>s+l.vacuum,0)/leads.length) : 0;
  const isDiamante = user.plan === "DIAMANTE";
  const { current, next } = getRank(user.xp);

  const sparkLeads   = [12,18,14,22,19,25,28,23,30,leads.length];
  const sparkVal     = [800,1200,950,1400,1100,1600,1900,1450,2100,totalVal];
  const sparkRate    = [45,52,48,58,55,62,59,65,70,recRate];
  const sparkVacuum  = [72,68,75,65,60,58,55,52,48,avgVacuum];

  const [mounted, setMounted] = useState(false);
  useEffect(()=>{ setTimeout(()=>setMounted(true),100); },[]);

  const alerts = [
    ...leads.filter(l=>l.lastContact>=14&&l.status!=="Ativo").map(l=>({ type:"hot", lead:l })),
    ...leads.filter(l=>l.lastContact>=7&&l.lastContact<14).map(l=>({ type:"cold", lead:l })),
    ...leads.filter(l=>l.vacuum<20&&l.status!=="Ativo").map(l=>({ type:"ready", lead:l })),
  ].slice(0,4);

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle}
        actions={
          <button onClick={()=>setScreen("recuperacao")}
            style={{ display:"flex", alignItems:"center", gap:7, background:`linear-gradient(135deg,${C.neon},${C.purple})`,
              color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontSize:12.5, fontWeight:700, cursor:"pointer",
              boxShadow:`0 4px 18px ${C.neonGlow}` }}>
            <Zap size={13}/> Recuperar Agora
          </button>
        }/>

      {/* Metrics */}
      <div className="metrics-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:14,
        opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(20px)", transition:"all 0.5s ease" }}>
        <MetricCard label="Leads Ativos" value={leads.length} icon={Users} color={C.neon}
          sub={`${inRisk} em risco`} trend={8} sparkData={sparkLeads} onClick={()=>setScreen("crm")}/>
        <MetricCard label="Clientes Recuperados" value={recovered} icon={CheckCircle} color={C.green}
          sub="últimos 30 dias" trend={12} sparkData={sparkRate} onClick={()=>setScreen("recuperacao")}/>
        <MetricCard label="Valor Recuperado" value={`R$${totalVal}`} icon={DollarSign} color={C.amber}
          sub="este mês" trend={18} sparkData={sparkVal} onClick={()=>setScreen("crm")}/>
        <MetricCard label="Score Vácuo Médio" value={`${avgVacuum}%`} icon={Activity} color={avgVacuum>60?C.red:C.cyan}
          sub="da base" trend={-5} sparkData={sparkVacuum} onClick={()=>setScreen("crm")}/>
      </div>

      {/* WhatsApp KPIs */}
      <div className="metrics-grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20,
        opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(20px)", transition:"all 0.5s ease 0.1s" }}>
        <div style={{ background:`linear-gradient(135deg, rgba(0,229,160,0.06), ${C.card})`,
          border:`1px solid ${C.green}30`, borderRadius:16, padding:"16px 20px",
          boxShadow:`0 4px 20px ${C.greenGlow}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`${C.green}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <MessageCircle size={14} color={C.green}/>
            </div>
            <span style={{ fontSize:10.5, color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>💬 Recuperações via WhatsApp</span>
          </div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:800, color:C.green }}>{Math.max(0, recovered - 1)}</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>mensagens enviadas este mês</div>
        </div>
        <div style={{ background:`linear-gradient(135deg, rgba(79,110,247,0.06), ${C.card})`,
          border:`1px solid ${C.neon}30`, borderRadius:16, padding:"16px 20px",
          boxShadow:`0 4px 20px ${C.neonGlow}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`${C.neon}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <TrendingUp size={14} color={C.neon}/>
            </div>
            <span style={{ fontSize:10.5, color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>📈 Taxa de Resposta</span>
          </div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:800, color:C.neon }}>{recRate}%</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>dos contatos responderam</div>
        </div>
        <div style={{ background:`linear-gradient(135deg, rgba(245,158,11,0.06), ${C.card})`,
          border:`1px solid ${C.amber}30`, borderRadius:16, padding:"16px 20px",
          boxShadow:`0 4px 20px ${C.amberGlow}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`${C.amber}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <DollarSign size={14} color={C.amber}/>
            </div>
            <span style={{ fontSize:10.5, color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>💰 Receita via WhatsApp</span>
          </div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:800, color:C.amber }}>R${Math.round(totalVal * 0.6)}</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>recuperados pelo WhatsApp</div>
        </div>
      </div>

      {/* Two columns */}
      <div className="dashboard-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, marginBottom:16 }}>
        {/* Left: Rank + Charts */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Rank card */}
          <GlassCard glow="neon" style={{ opacity:mounted?1:0, transition:"all 0.6s ease 0.1s" }}>
            <div className="rank-gauge-row" style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", color:C.muted, margin:"0 0 4px", fontWeight:700 }}>Progressão de Rank</p>
                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800, margin:"0 0 14px",
                  color:current.color, textShadow:`0 0 20px ${current.color}60` }}>{current.emoji} {current.name}</h3>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
                  {RANKS.map(r => {
                    const RI = r.icon; const reached = user.xp >= r.min;
                    return (
                      <div key={r.name} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10.5,
                        padding:"4px 9px", borderRadius:100,
                        background:reached?`${r.color}15`:`${C.subtle}40`,
                        color:reached?r.color:C.subtle,
                        border:`1px solid ${reached?r.color+"40":C.border}`,
                        boxShadow:current.name===r.name?`0 0 14px ${r.color}40`:"none",
                        transition:"all 0.3s" }}>
                        <RI size={10}/><span>{r.name}</span>
                        {!reached && <Lock size={8} style={{ opacity:0.4 }}/>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ height:6, background:C.subtle, borderRadius:100, overflow:"hidden", maxWidth:360 }}>
                  <div style={{ height:"100%", borderRadius:100,
                    background:`linear-gradient(90deg, ${current.color}, ${C.neon})`,
                    width:next?`${Math.min(100,((user.xp-current.min)/(next.min-current.min))*100)}%`:"100%",
                    transition:"width 0.8s ease", boxShadow:`0 0 12px ${current.color}60` }}/>
                </div>
                <p style={{ fontSize:11, color:C.muted, margin:"8px 0 0", fontFamily:"monospace" }}>
                  {next ? `${user.xp} / ${next.min} XP — faltam ${next.min-user.xp} XP para ${next.emoji} ${next.name}` : "🏆 Rank máximo atingido!"}
                </p>
              </div>
              <div className="vacuum-gauge"><VacuumGauge value={avgVacuum} size={110}/></div>
            </div>
          </GlassCard>

          {/* Quick tools */}
          <GlassCard noPad style={{ opacity:mounted?1:0, transition:"all 0.6s ease 0.2s" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.07em", color:C.muted, margin:0, fontWeight:700 }}>Ferramentas IA</p>
            </div>
            <div className="quick-tools-grid" style={{ padding:"14px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { id:"recuperacao", title:"Recuperação IA",  desc:"Reative leads parados",   icon:RotateCcw,         color:C.green,  locked:false },
                { id:"closer",      title:"Closer IA",       desc:"Quebre objeções em tempo real", icon:MessageSquareText, color:C.neon, locked:!isDiamante },
                { id:"treinamentos",title:"Treinamentos",    desc:"Scripts e técnicas avançadas",  icon:GraduationCap,     color:C.purple, locked:false },
                { id:"relatorios",  title:"Relatórios",      desc:"Análise completa de performance",icon:BarChart2,        color:C.amber,  locked:!isDiamante },
              ].map(c => {
                const Icon = c.icon;
                return (
                  <button key={c.id} onClick={()=>setScreen(c.locked?"locked:"+c.id:c.id)}
                    style={{ textAlign:"left", background:C.surface, border:`1px solid ${C.border}`,
                      borderRadius:12, padding:"13px 14px", cursor:"pointer", transition:"all 0.15s",
                      display:"flex", alignItems:"center", gap:10 }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=c.color+"60"; e.currentTarget.style.background=`${c.color}08`; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface; }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:`${c.color}15`,
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon size={15} color={c.locked?C.amber:c.color}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:c.locked?C.muted:C.text, display:"flex", alignItems:"center", gap:6 }}>
                        {c.title}
                        {c.locked && <Lock size={10} color={C.amber}/>}
                      </div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>{c.desc}</div>
                    </div>
                    <ChevronRight size={12} color={C.muted}/>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right: Alerts + Achievements */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* System Alerts */}
          <GlassCard noPad glow="red" style={{ opacity:mounted?1:0, transition:"all 0.6s ease 0.15s" }}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Bell size={14} color={C.red}/>
                <span style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:C.text }}>Alertas</span>
              </div>
              <span style={{ background:C.red+"20", color:C.red, fontSize:10, fontWeight:700,
                padding:"2px 7px", borderRadius:100, border:`1px solid ${C.red}40` }}>{alerts.length}</span>
            </div>
            <div style={{ padding:"10px 10px", display:"flex", flexDirection:"column", gap:6 }}>
              {alerts.length === 0 ? (
                <div style={{ padding:"20px", textAlign:"center", color:C.muted, fontSize:12 }}>
                  <CheckCircle size={20} color={C.green} style={{ marginBottom:8, display:"block", margin:"0 auto 8px" }}/>
                  Tudo sob controle!
                </div>
              ) : alerts.map((a,i) => {
                const vc = getVC(a.lead.lastContact);
                return (
                  <button key={i} onClick={()=>setScreen("recuperacao")}
                    style={{ display:"flex", alignItems:"center", gap:10, textAlign:"left",
                      background:`${C.surface}80`, border:`1px solid ${C.border}`,
                      borderRadius:10, padding:"10px 12px", cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=vc.color+"50"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; }}>
                    <span style={{ fontSize:16 }}>{a.type==="hot"?"🔴":a.type==="cold"?"🔥":"🟢"}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.lead.name}</div>
                      <div style={{ fontSize:10.5, color:vc.color }}>{a.lead.lastContact}d sem resposta · {vc.label}</div>
                    </div>
                    <ChevronRight size={12} color={C.muted}/>
                  </button>
                );
              })}
              {alerts.length > 0 && (
                <button onClick={()=>setScreen("recuperacao")}
                  style={{ width:"100%", background:`linear-gradient(135deg,${C.red}20,${C.orange}10)`,
                    border:`1px solid ${C.red}40`, color:C.red, fontWeight:700, fontSize:12,
                    padding:"9px", borderRadius:9, cursor:"pointer", marginTop:4 }}>
                  Ver Todos os Alertas →
                </button>
              )}
            </div>
          </GlassCard>

          {/* Conquistas */}
          <GlassCard noPad glow="amber" style={{ opacity:mounted?1:0, transition:"all 0.6s ease 0.25s" }}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8 }}>
              <Trophy size={14} color={C.amber}/>
              <span style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:C.text }}>Conquistas</span>
              <span style={{ marginLeft:"auto", fontSize:10, color:C.muted }}>{(user.achievements||[]).length}/{ACHIEVEMENTS.length}</span>
            </div>
            <div style={{ padding:"10px 12px", display:"flex", flexDirection:"column", gap:6 }}>
              {ACHIEVEMENTS.slice(0,4).map(a => {
                const has = (user.achievements||[]).includes(a.id);
                return (
                  <div key={a.id} style={{ display:"flex", alignItems:"center", gap:10,
                    padding:"8px 10px", borderRadius:9,
                    background:has?`${C.amber}08`:`${C.subtle}20`,
                    border:`1px solid ${has?C.amber+"30":C.border}`,
                    opacity:has?1:0.4, transition:"all 0.3s" }}>
                    <span style={{ fontSize:18 }}>{a.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11.5, fontWeight:700, color:has?C.amber:C.muted }}>{a.name}</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>{a.desc}</div>
                    </div>
                    {has && <Check size={12} color={C.amber}/>}
                  </div>
                );
              })}
              <button onClick={()=>setScreen("gamificacao")}
                style={{ width:"100%", background:"transparent", border:`1px solid ${C.border}`,
                  color:C.muted, fontWeight:600, fontSize:11.5, padding:"8px", borderRadius:9, cursor:"pointer", marginTop:2 }}>
                Ver todas as conquistas →
              </button>
            </div>
          </GlassCard>

          {/* Plan upgrade */}
          {!isDiamante && (
            <GlassCard glow="purple" style={{ opacity:mounted?1:0, transition:"all 0.6s ease 0.3s",
              background:"linear-gradient(135deg,rgba(124,58,237,0.1),rgba(79,110,247,0.05))" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <Gem size={16} color={C.purple}/>
                <span style={{ fontSize:12, fontWeight:700, color:C.purple, textTransform:"uppercase", letterSpacing:"0.05em" }}>Upgrade Diamante</span>
              </div>
              <p style={{ fontSize:12.5, color:C.muted, margin:"0 0 14px", lineHeight:1.6 }}>
                Closer IA, Follow-Up IA, Relatórios Avançados e Automações — tudo liberado.
              </p>
              <button onClick={()=>{ setUser(u=>({...u,plan:"DIAMANTE"})); showToast("Plano Diamante ativado! 💠","success"); }}
                style={{ width:"100%", background:`linear-gradient(135deg,${C.purple},${C.neon})`, color:"#fff",
                  border:"none", fontWeight:700, fontSize:13, padding:"11px", borderRadius:10, cursor:"pointer",
                  boxShadow:`0 6px 20px ${C.purpleGlow}` }}>
                💠 Ativar Diamante
              </button>
            </GlassCard>
          )}
        </div>
      </div>

      {/* ── OWNER DASHBOARD — ROI em tempo real ── */}
      {(() => {
        const todayMsgs = getWASendCount(user.uid||user.name);
        const totalLeads = leads.length;
        const avgTicket = totalLeads > 0 ? Math.round(leads.reduce((s,l)=>s+l.value,0)/totalLeads) : 300;
        const respRate = recRate || 20;
        const estimatedConverted = Math.round(todayMsgs * (respRate/100));
        const estimatedRevenue = estimatedConverted * avgTicket;
        const waRemaining = WA_DAILY_LIMIT - todayMsgs;
        return (
          <GlassCard glow="amber" style={{ marginTop:16, opacity:mounted?1:0, transition:"all 0.6s ease 0.4s",
            background:"linear-gradient(135deg,rgba(245,158,11,0.06),rgba(0,229,160,0.03))" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`${C.amber}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <DollarSign size={16} color={C.amber}/>
              </div>
              <div>
                <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:800, color:C.amber, margin:0 }}>📊 Painel do Dono — Hoje</p>
                <p style={{ fontSize:11, color:C.muted, margin:0 }}>Seu ROI estimado em tempo real</p>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:14 }}>
              {[
                { label:"Msgs geradas hoje",   value:todayMsgs,        icon:"💬", color:C.neon,  sub:`${waRemaining} restantes` },
                { label:"Respostas estimadas", value:estimatedConverted, icon:"✅", color:C.green, sub:`${respRate}% taxa média` },
                { label:"R$ estimado",         value:`R$${estimatedRevenue}`, icon:"💰", color:C.amber, sub:`ticket médio R$${avgTicket}` },
              ].map(s=>(
                <div key={s.label} style={{ background:C.surface, border:`1px solid ${s.color}25`, borderRadius:12, padding:"12px 14px" }}>
                  <div style={{ fontSize:20, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:10.5, color:C.muted, marginTop:3, fontWeight:600 }}>{s.label}</div>
                  <div style={{ fontSize:10, color:C.subtle, marginTop:2 }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ background:`${C.amber}08`, border:`1px solid ${C.amber}25`, borderRadius:10, padding:"12px 14px",
              display:"flex", alignItems:"flex-start", gap:10 }}>
              <span style={{ fontSize:20, flexShrink:0 }}>🧮</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:C.amber, margin:"0 0 4px" }}>Simulação do dia</p>
                <p style={{ fontSize:12.5, color:C.muted, margin:0, lineHeight:1.6 }}>
                  {todayMsgs === 0
                    ? "Você ainda não gerou mensagens hoje. Comece agora — cada mensagem pode valer R$" + avgTicket + " no bolso."
                    : `Você gerou ${todayMsgs} mensagem${todayMsgs>1?"s":""}. Se ${estimatedConverted > 0 ? estimatedConverted : "algum lead"} ${estimatedConverted===1?"voltar":"voltarem"} = `
                      + (estimatedRevenue > 0 ? `💰 R$${estimatedRevenue} no bolso hoje.` : "potencial de receita direto.")
                  }
                </p>
              </div>
            </div>
          </GlassCard>
        );
      })()}
    </div>
  );
}

/* ═══════════════════════════════════ CRM */
function CRMScreen({ user, setUser, showToast, onXP, onMenuToggle }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name:"", phone:"", product:"", value:"", lastContact:"", obs:"" });

  const leads = user.leads || [];
  const statuses = ["Todos","Em Risco","Esfriando","Atenção","Ativo"];
  const filtered = leads
    .filter(l=>(filter==="Todos"||l.status===filter)&&(l.name+l.product).toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>b.lastContact-a.lastContact);

  function openEdit(l) {
    setForm(l ? { name:l.name, phone:l.phone, product:l.product, value:String(l.value), lastContact:String(l.lastContact), obs:l.obs||"" } : { name:"",phone:"",product:"",value:"",lastContact:"",obs:"" });
    setModal(l || "add");
  }

  function save() {
    if (modal === "add") {
      const newL = { id:Date.now(), name:form.name, phone:form.phone, product:form.product,
        value:parseFloat(form.value)||0, lastContact:parseInt(form.lastContact)||0,
        status: parseInt(form.lastContact)>14?"Em Risco":parseInt(form.lastContact)>7?"Esfriando":parseInt(form.lastContact)>3?"Atenção":"Ativo",
        vacuum: Math.min(99,parseInt(form.lastContact)*5||0), obs:form.obs };
      setUser(u=>({...u, leads:[...u.leads, newL], xp:u.xp+50, achievements:u.achievements.includes("primeiro_lead")?u.achievements:[...u.achievements,"primeiro_lead"]}));
      onXP(50); showToast("Lead cadastrado! +50 XP","success");
    } else {
      setUser(u=>({...u, leads:u.leads.map(l=>l.id===modal.id?{...l,...form,value:parseFloat(form.value)||0,lastContact:parseInt(form.lastContact)||0}:l)}));
      showToast("Lead atualizado","success");
    }
    setModal(null);
  }

  const F = ({ label, field, placeholder, type="text" }) => (
    <div style={{ marginBottom:12 }}>
      <label style={{ display:"block", fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.05em",
        color:C.muted, marginBottom:5, fontWeight:700 }}>{label}</label>
      <input type={type} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={placeholder}
        style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, color:C.text,
          borderRadius:9, padding:"10px 13px", fontSize:13.5, outline:"none", boxSizing:"border-box",
          fontFamily:"'Inter',sans-serif" }}
        onFocus={e=>e.target.style.borderColor=C.neon} onBlur={e=>e.target.style.borderColor=C.border}/>
    </div>
  );

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle} title="CRM" sub="Gestão de Clientes e Pipeline"/>
      {/* Stats row */}
      <div className="metrics-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total de Leads",  value:leads.length,                          color:C.neon,   icon:Users },
          { label:"Em Risco",        value:leads.filter(l=>l.lastContact>=8).length, color:C.red,  icon:AlertTriangle },
          { label:"Recuperados",     value:leads.filter(l=>l.status==="Ativo").length, color:C.green, icon:CheckCircle },
          { label:"Valor em Risco",  value:`R$${leads.filter(l=>l.lastContact>=8).reduce((s,l)=>s+l.value,0)}`, color:C.amber, icon:DollarSign },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:`${m.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon size={13} color={m.color}/>
                </div>
                <span style={{ fontSize:10.5, color:C.muted, fontWeight:600 }}>{m.label}</span>
              </div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:800, color:m.color }}>{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:180 }}>
          <Search size={13} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.muted }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar lead..."
            style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, color:C.text,
              borderRadius:9, padding:"9px 13px 9px 34px", fontSize:13, outline:"none", boxSizing:"border-box" }}
            onFocus={e=>e.target.style.borderColor=C.neon} onBlur={e=>e.target.style.borderColor=C.border}/>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {statuses.map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              style={{ padding:"8px 13px", background:filter===s?`${C.neon}15`:"transparent",
                border:`1px solid ${filter===s?C.neon:C.border}`, color:filter===s?C.neon:C.muted,
                fontSize:12, fontWeight:600, borderRadius:8, cursor:"pointer", transition:"all 0.15s" }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>exportLeadsCSV(leads)}
            style={{ display:"flex", alignItems:"center", gap:6, background:C.card, border:`1px solid ${C.border}`,
              color:C.muted, borderRadius:9, padding:"9px 14px", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>
            <Download size={13}/> CSV
          </button>
          <button onClick={()=>openEdit(null)}
            style={{ display:"flex", alignItems:"center", gap:6, background:`linear-gradient(135deg,${C.neon},${C.purple})`,
              color:"#fff", border:"none", borderRadius:9, padding:"9px 16px", fontSize:12.5, fontWeight:700, cursor:"pointer",
              boxShadow:`0 4px 14px ${C.neonGlow}` }}>
            <Plus size={14}/> Novo Lead
          </button>
        </div>
      </div>

      {/* Table */}
      <GlassCard noPad>
        <div className="leads-table-header" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1.4fr 0.7fr 1fr 0.8fr 1.1fr",
          padding:"12px 20px", borderBottom:`1px solid ${C.border}`, gap:8 }}>
          {["Nome","WhatsApp","Produto","Dias","Status","Vácuo","Ação"].map(h=>(
            <span key={h} style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", color:C.muted, fontWeight:700 }}>{h}</span>
          ))}
        </div>
        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:"64px 32px", animation:"fadeInUp 0.5s ease" }}>
            <div style={{ width:64, height:64, borderRadius:18, background:`${C.neon}10`,
              border:`1px solid ${C.neon}20`, display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 18px" }}>
              {filter==="Todos" && leads.length===0
                ? <Users size={26} color={C.neon} opacity={0.5}/>
                : <Search size={26} color={C.neon} opacity={0.5}/>}
            </div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:700,
              color:C.text, margin:"0 0 8px" }}>
              {filter==="Todos" && leads.length===0
                ? "Nenhum lead cadastrado ainda."
                : "Nenhum resultado para essa busca."}
            </h3>
            <p style={{ color:C.muted, fontSize:13, margin:"0 0 20px", lineHeight:1.6 }}>
              {filter==="Todos" && leads.length===0
                ? "Adicione seu primeiro lead e comece a recuperar faturamento."
                : "Tente outro filtro ou limpe a busca."}
            </p>
            {filter==="Todos" && leads.length===0 && (
              <button onClick={()=>openEdit(null)}
                style={{ background:`linear-gradient(135deg,${C.neon},${C.purple})`, color:"#fff",
                  border:"none", borderRadius:9, padding:"10px 20px", fontSize:13, fontWeight:700,
                  cursor:"pointer", boxShadow:`0 4px 16px ${C.neonGlow}`,
                  display:"inline-flex", alignItems:"center", gap:7 }}>
                <Plus size={14}/> Adicionar Primeiro Lead
              </button>
            )}
          </div>
        )}
        {filtered.map((l,i) => {
          const vc = getVC(l.lastContact);
          return (
            <div key={l.id} className="leads-table-row"
              style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1.4fr 0.7fr 1fr 0.8fr 1.1fr",
                padding:"13px 20px", borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",
                gap:8, alignItems:"center", transition:"background 0.12s" }}
              onMouseEnter={e=>e.currentTarget.style.background=`${C.card}80`}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{l.name}</div>
                <div style={{ fontSize:10.5, color:C.amber, marginTop:1, fontFamily:"monospace" }}>R${l.value}</div>
              </div>
              <div className="lead-col-phone" style={{ fontSize:11.5, color:C.muted, fontFamily:"monospace" }}>
                {l.phone.replace(/(\d{2})(\d{5})(\d{4})/,"($1) $2-$3")}
              </div>
              <div className="lead-col-product" style={{ fontSize:12.5, color:C.text }}>{l.product}</div>
              <div style={{ fontSize:13, fontWeight:700, fontFamily:"monospace", color:vc.color }}>{l.lastContact}d</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:100,
                fontSize:11, fontWeight:700, background:vc.bg, color:vc.color, width:"fit-content",
                border:`1px solid ${vc.color}30` }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:vc.color, flexShrink:0 }}/>
                {vc.label}
              </div>
              <div className="lead-col-vacuum" style={{ fontFamily:"monospace", fontSize:13, fontWeight:700,
                color:l.vacuum>70?C.red:l.vacuum>40?C.orange:C.green }}>{l.vacuum}%</div>
              <div style={{ display:"flex", gap:5 }}>
                <button onClick={()=>openWhatsApp(l.phone,`Oi ${l.name.split(" ")[0]}! 👋`)} title="WhatsApp"
                  style={{ background:`${C.green}15`, border:`1px solid ${C.green}30`, color:C.green,
                    borderRadius:7, padding:"5px 8px", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  <MessageCircle size={12}/>
                </button>
                <button onClick={()=>openEdit(l)} title="Editar"
                  style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted,
                    borderRadius:7, padding:"5px 8px", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  <Edit3 size={12}/>
                </button>
                <button onClick={()=>setDeleteTarget(l)} title="Remover"
                  style={{ background:`${C.red}12`, border:`1px solid ${C.red}25`, color:C.red,
                    borderRadius:7, padding:"5px 8px", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  <Trash2 size={12}/>
                </button>
              </div>
            </div>
          );
        })}
      </GlassCard>

      {/* Modals */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex",
          alignItems:"center", justifyContent:"center", zIndex:9999, padding:20, backdropFilter:"blur(8px)" }}
          onClick={e=>{ if(e.target===e.currentTarget) setModal(null); }}>
          <div style={{ background:C.card, border:`1px solid ${C.borderHi}`, borderRadius:18, padding:"26px 28px", maxWidth:440, width:"100%",
            maxHeight:"90vh", overflowY:"auto", boxShadow:`0 24px 64px rgba(0,0,0,0.6)`, animation:"popIn 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, margin:0, color:C.text }}>{modal==="add"?"Novo Lead":"Editar Lead"}</h3>
              <button onClick={()=>setModal(null)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}><X size={18}/></button>
            </div>
            <F label="Nome" field="name" placeholder="Nome do lead"/>
            <F label="WhatsApp" field="phone" placeholder="11987654321"/>
            <F label="Produto/Serviço" field="product" placeholder="Ex: Corte + Barba"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <F label="Valor (R$)" field="value" placeholder="0" type="number"/>
              <F label="Dias sem resposta" field="lastContact" placeholder="0" type="number"/>
            </div>
            <div>
              <label style={{ display:"block", fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.05em",
                color:C.muted, marginBottom:5, fontWeight:700 }}>Observações</label>
              <textarea value={form.obs} onChange={e=>setForm(f=>({...f,obs:e.target.value}))} rows={3}
                placeholder="Ex: Pediu o preço e sumiu"
                style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, color:C.text,
                  borderRadius:9, padding:"10px 13px", fontSize:13.5, outline:"none", resize:"vertical", boxSizing:"border-box",
                  fontFamily:"'Inter',sans-serif" }}
                onFocus={e=>e.target.style.borderColor=C.neon} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            <button onClick={save} disabled={!form.name.trim()}
              style={{ marginTop:18, width:"100%", background:`linear-gradient(135deg,${C.neon},${C.purple})`,
                color:"#fff", border:"none", fontWeight:700, fontSize:14, padding:"13px", borderRadius:10,
                cursor:form.name.trim()?"pointer":"not-allowed", opacity:form.name.trim()?1:0.5,
                boxShadow:`0 6px 20px ${C.neonGlow}` }}>
              {modal==="add"?"Cadastrar Lead +50 XP":"Salvar Alterações"}
            </button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex",
          alignItems:"center", justifyContent:"center", zIndex:10001, padding:20, backdropFilter:"blur(8px)" }}
          onClick={e=>{ if(e.target===e.currentTarget) setDeleteTarget(null); }}>
          <div style={{ background:C.card, border:`1px solid ${C.borderHi}`, borderRadius:18, padding:28, maxWidth:320, width:"100%",
            textAlign:"center", animation:"popIn 0.3s ease" }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`${C.red}15`,
              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <Trash2 size={22} color={C.red}/>
            </div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, margin:"0 0 8px", color:C.text }}>Remover lead?</h3>
            <p style={{ color:C.muted, fontSize:13, margin:"0 0 22px" }}>
              <strong style={{ color:C.text }}>{deleteTarget.name}</strong> será removido permanentemente.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setDeleteTarget(null)}
                style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, color:C.muted,
                  fontWeight:600, fontSize:13, padding:"11px", borderRadius:9, cursor:"pointer" }}>Cancelar</button>
              <button onClick={()=>{ setUser(u=>({...u,leads:u.leads.filter(x=>x.id!==deleteTarget.id)})); showToast("Lead removido","info"); setDeleteTarget(null); }}
                style={{ flex:1, background:C.red, color:"#fff", border:"none",
                  fontWeight:700, fontSize:13, padding:"11px", borderRadius:9, cursor:"pointer",
                  boxShadow:`0 4px 16px ${C.redGlow}` }}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════ WHATSAPP MODAL */
function WhatsAppModal({ lead, onClose, showToast, userId }) {
  const [tab, setTab] = useState("flowup"); // "flowup" | "avulsa"
  const defaultType = getWAType(lead);
  const [activeType, setActiveType] = useState(defaultType);
  const [msgIdx, setMsgIdx] = useState(0);
  const [customMsg, setCustomMsg] = useState(getWAMessage(defaultType, lead, 0) + IA_DISCLAIMER);
  const [copied, setCopied] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [waCount, setWaCount] = useState(() => getWASendCount(userId || "anon"));
  const [limitPopup, setLimitPopup] = useState(false);

  const flowSeq = buildFlowSequence(lead.name, lead.product, lead.value);
  const remaining = WA_DAILY_LIMIT - waCount;
  const limitReached = remaining <= 0;

  const typeLabels = {
    sumido:"Cliente Sumido", semResposta:"Sem Resposta", objPreco:"Objeção de Preço",
    proposta:"Abandono de Proposta", cancelamento:"Cancelamento", semInteresse:"Perda de Interesse"
  };
  const allTypes = Object.keys(WA_MESSAGES);

  function switchMsg(type, idx=0) {
    setActiveType(type);
    setMsgIdx(idx);
    setCustomMsg(getWAMessage(type, lead, idx) + IA_DISCLAIMER);
  }

  function copyMsg(text, idx=null) {
    clip(text, ()=>{
      if (idx !== null) setCopiedIdx(idx); else setCopied(true);
      showToast("Mensagem copiada!","success");
      setTimeout(()=>{ setCopied(false); setCopiedIdx(null); },2000);
    });
  }

  function handleOpenWA(text) {
    if (limitReached) { setLimitPopup(true); return; }
    const count = incrementWASend(userId || "anon");
    setWaCount(count);
    openWhatsApp(lead.phone, text);
  }

  const counterColor = remaining <= 5 ? C.red : remaining <= 10 ? C.amber : C.green;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex",
      alignItems:"center", justifyContent:"center", zIndex:10005, padding:20, backdropFilter:"blur(12px)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:C.card, border:`1px solid ${C.green}40`, borderRadius:22, padding:"24px 26px",
        maxWidth:560, width:"100%", maxHeight:"92vh", overflowY:"auto",
        boxShadow:`0 32px 80px rgba(0,0,0,0.7), 0 0 40px ${C.greenGlow}`,
        animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:`${C.green}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <MessageCircle size={14} color={C.green}/>
              </div>
              <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", color:C.green, fontWeight:700 }}>💬 Mensagem WhatsApp</span>
            </div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, margin:0, color:C.text }}>{lead.name}</h3>
            <p style={{ color:C.muted, fontSize:12, margin:"2px 0 0" }}>{lead.product} · R${lead.value} · {lead.lastContact}d sem resposta</p>
          </div>
          <button onClick={onClose} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", borderRadius:8, padding:6, display:"flex" }}><X size={16}/></button>
        </div>

        {/* WA Counter Badge — Blindagem Meta */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, marginBottom:16,
          background: limitReached ? `${C.red}12` : remaining <= 5 ? `${C.red}10` : `${C.green}08`,
          border:`1px solid ${counterColor}40` }}>
          <Shield size={14} color={counterColor}/>
          <div style={{ flex:1 }}>
            <span style={{ fontSize:12.5, fontWeight:700, color:counterColor }}>
              {limitReached ? "🚫 Limite diário atingido!" : `Restam ${remaining}/${WA_DAILY_LIMIT} envios hoje`}
            </span>
            <span style={{ fontSize:10.5, color:C.muted, display:"block", marginTop:1 }}>
              Blindagem Meta · Limite 20 envios/dia via botão
            </span>
          </div>
          {!limitReached && (
            <div style={{ fontFamily:"monospace", fontSize:11, color:counterColor, fontWeight:800,
              padding:"3px 8px", background:`${counterColor}15`, borderRadius:100, border:`1px solid ${counterColor}30` }}>
              {waCount}/{WA_DAILY_LIMIT}
            </div>
          )}
        </div>

        {/* Meta policy notice */}
        <div style={{ display:"flex", gap:8, padding:"8px 12px", borderRadius:8, marginBottom:14,
          background:`${C.amber}08`, border:`1px solid ${C.amber}25` }}>
          <AlertTriangle size={13} color={C.amber} style={{ flexShrink:0, marginTop:1 }}/>
          <span style={{ fontSize:11, color:C.amber, lineHeight:1.5 }}>
            Política Meta: máx. 20 disparos proativos/dia para evitar bloqueio. A IA gera ilimitado — só o envio tem limite.
          </span>
        </div>

        {/* Tab selector */}
        <div style={{ display:"flex", gap:6, marginBottom:16, background:C.surface, padding:4, borderRadius:10, border:`1px solid ${C.border}` }}>
          {[
            { id:"flowup", label:"🔁 Flow Up (4 etapas)" },
            { id:"avulsa", label:"✉️ Mensagem Avulsa" },
          ].map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{ flex:1, padding:"8px 12px", borderRadius:7, border:"none", fontSize:12.5, fontWeight:700, cursor:"pointer",
                background:tab===t.id?`${C.neon}18`:"transparent", color:tab===t.id?C.neon:C.muted, transition:"all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: FLOW UP ── */}
        {tab === "flowup" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {flowSeq.map((item, i) => (
              <div key={i} style={{ background:C.surface, border:`1px solid ${item.color}30`, borderRadius:12, padding:"13px 15px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, fontWeight:800, color:item.color, background:`${item.color}15`,
                      padding:"3px 9px", borderRadius:100, border:`1px solid ${item.color}30` }}>{item.day}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{item.icon} {item.label}</span>
                  </div>
                  <div style={{ display:"flex", gap:5 }}>
                    <button onClick={()=>copyMsg(item.text, i)}
                      style={{ background:`${C.neon}12`, border:`1px solid ${C.neon}25`, color:C.neon,
                        borderRadius:6, padding:"4px 9px", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                      {copiedIdx===i ? <><Check size={10}/> Ok!</> : <><Copy size={10}/> Copiar</>}
                    </button>
                    <button onClick={()=>handleOpenWA(item.text)}
                      disabled={limitReached}
                      style={{ background:limitReached?`${C.red}15`:`${C.green}18`, border:`1px solid ${limitReached?C.red:C.green}35`,
                        color:limitReached?C.red:C.green, borderRadius:6, padding:"4px 9px", fontSize:11, cursor:limitReached?"not-allowed":"pointer",
                        display:"flex", alignItems:"center", gap:4 }}>
                      <MessageCircle size={10}/> {limitReached?"Bloqueado":"WA"}
                    </button>
                  </div>
                </div>
                <p style={{ fontSize:12.5, lineHeight:1.65, margin:0, color:C.muted, fontStyle:"italic" }}>{item.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: MENSAGEM AVULSA ── */}
        {tab === "avulsa" && (
          <div>
            {/* Type selector */}
            <div style={{ marginBottom:12 }}>
              <p style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", color:C.muted, margin:"0 0 8px", fontWeight:700 }}>Tipo de Mensagem</p>
              <div className="wa-type-row" style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {allTypes.map(t => (
                  <button key={t} onClick={()=>switchMsg(t,0)}
                    style={{ padding:"5px 11px", borderRadius:100, border:`1px solid ${activeType===t?C.green:C.border}`,
                      background:activeType===t?`${C.green}15`:"transparent",
                      color:activeType===t?C.green:C.muted, fontSize:11, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}>
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Message preview & edit */}
            <div style={{ background:C.surface, border:`1px solid ${C.green}30`, borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:C.green }}>📱 Mensagem Sugerida</span>
                <button onClick={()=>{ const idx=(msgIdx+1)%3; switchMsg(activeType,idx); }}
                  style={{ background:`${C.neon}12`, border:`1px solid ${C.neon}30`, color:C.neon, borderRadius:6, padding:"3px 10px", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                  <RefreshCw size={10}/> Outra versão
                </button>
              </div>
              <textarea value={customMsg} onChange={e=>setCustomMsg(e.target.value)} rows={5}
                style={{ width:"100%", background:"transparent", border:"none", color:C.text,
                  fontSize:13.5, lineHeight:1.7, outline:"none", resize:"vertical", fontFamily:"'Inter',sans-serif",
                  boxSizing:"border-box" }}/>
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button onClick={()=>copyMsg(customMsg)}
                style={{ flex:1, minWidth:120, background:copied?`${C.green}20`:`${C.neon}12`, border:`1px solid ${copied?C.green:C.neon}40`,
                  color:copied?C.green:C.neon, fontWeight:700, fontSize:12.5, padding:"11px", borderRadius:10, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all 0.2s" }}>
                {copied ? <><Check size={13}/> Copiado!</> : <><Copy size={13}/> Copiar</>}
              </button>
              <button onClick={()=>{ const txt = customMsg + "\n\n⚠️ Rascunho IA. Revise antes de enviar."; clip(txt, ()=>showToast("Copiado com aviso!","success")); }}
                style={{ flex:1, minWidth:130, background:`${C.amber}12`, border:`1px solid ${C.amber}35`, color:C.amber,
                  fontWeight:700, fontSize:12.5, padding:"11px", borderRadius:10, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <AlertTriangle size={13}/> Copiar com Aviso
              </button>
              <button onClick={()=>handleOpenWA(customMsg)} disabled={limitReached}
                style={{ flex:1.3, minWidth:130, background:limitReached?`${C.red}15`:`linear-gradient(135deg,${C.green},#00b894)`,
                  color:limitReached?"#fff":"#000", border:`1px solid ${limitReached?C.red:"transparent"}`,
                  fontWeight:800, fontSize:12.5, padding:"11px", borderRadius:10, cursor:limitReached?"not-allowed":"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                  boxShadow:limitReached?"none":`0 6px 20px ${C.greenGlow}` }}>
                {limitReached ? <><Shield size={13}/> Bloqueado</> : <><MessageCircle size={14}/> 📲 Abrir WhatsApp</>}
              </button>
            </div>
          </div>
        )}

        {/* Fallback script when limit reached */}
        {limitReached && (
          <div style={{ marginTop:16, padding:"14px 16px", borderRadius:12, background:`${C.red}08`, border:`1px solid ${C.red}30` }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
              <FileText size={14} color={C.red}/>
              <span style={{ fontSize:11.5, fontWeight:700, color:C.red }}>📋 Script Manual — Copie e Cole no WhatsApp</span>
            </div>
            <p style={{ fontSize:11.5, color:C.muted, margin:"0 0 10px", lineHeight:1.5 }}>
              Limite de 20 envios atingido. Copie a mensagem abaixo e cole manualmente no WhatsApp para continuar.
            </p>
            <div style={{ background:C.surface, borderRadius:8, padding:"10px 12px", marginBottom:10 }}>
              <p style={{ fontSize:12.5, color:C.text, margin:0, lineHeight:1.6 }}>{flowSeq[0].text}</p>
            </div>
            <button onClick={()=>copyMsg(flowSeq[0].text)}
              style={{ width:"100%", background:`${C.amber}15`, border:`1px solid ${C.amber}35`, color:C.amber,
                fontWeight:700, fontSize:12.5, padding:"10px", borderRadius:8, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <Copy size={13}/> Copiar Script Manual
            </button>
          </div>
        )}
      </div>

      {/* Limit popup */}
      {limitPopup && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10010, padding:20 }}
          onClick={()=>setLimitPopup(false)}>
          <div style={{ background:C.card, border:`1px solid ${C.red}50`, borderRadius:18, padding:"28px 28px", maxWidth:360, width:"100%", textAlign:"center",
            animation:"popIn 0.3s ease", boxShadow:`0 24px 60px rgba(0,0,0,0.7), 0 0 40px ${C.redGlow}` }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:52, marginBottom:14 }}>🚫</div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, margin:"0 0 10px", color:C.red }}>Limite Diário Atingido</h3>
            <p style={{ color:C.muted, fontSize:13, margin:"0 0 8px", lineHeight:1.6 }}>
              Você atingiu os <strong style={{color:C.text}}>20 envios diários</strong> via WhatsApp para proteger sua conta Meta.
            </p>
            <p style={{ color:C.amber, fontSize:12, margin:"0 0 20px", fontWeight:600 }}>
              ⏰ O limite renova à meia-noite. Use o Script Manual para envios extras.
            </p>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setLimitPopup(false)}
                style={{ flex:1, background:`${C.amber}15`, border:`1px solid ${C.amber}35`, color:C.amber,
                  fontWeight:700, fontSize:13, padding:"11px", borderRadius:9, cursor:"pointer" }}>
                📋 Usar Script Manual
              </button>
              <button onClick={()=>setLimitPopup(false)}
                style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, color:C.muted,
                  fontWeight:600, fontSize:13, padding:"11px", borderRadius:9, cursor:"pointer" }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════ IA STRATEGY MODAL */
function IAStrategyModal({ lead, niche, onClose, showToast }) {
  const [step, setStep] = useState(0);
  const [strat, setStrat] = useState("");
  const [loading, setLoading] = useState(true);
  const STEPS = ["Analisando cliente...", "Identificando objeções...", "Montando estratégia...", "Gerando resposta..."];

  useEffect(()=>{
    let i = 0;
    const t = setInterval(()=>{ i++; if(i>=STEPS.length-1) clearInterval(t); setStep(i); }, 800);
    const sys = `Você é um especialista em recuperação de vendas no nicho de ${NICHE_LABEL[niche]}.
Gere uma estratégia DIRETA e PRÁTICA para recuperar este cliente.
Responda em 3 partes EXATAS sem markdown:
1. DIAGNÓSTICO: (1 frase sobre o porquê o cliente sumiu)
2. ABORDAGEM: (3 passos práticos e específicos para reconquistá-lo)
3. SCRIPT DE FECHAMENTO: (1 pergunta de fechamento irresistível)
Português brasileiro. Sem asteriscos. Sem listas com símbolos.`;
    callIA(sys, [{ role:"user", content:`Nome: ${lead.name}. Produto: ${lead.product}. Valor: R$${lead.value}. Dias sem resposta: ${lead.lastContact}. Situação: ${lead.obs||"sumiu sem motivo aparente"}.` }])
      .then(r=>{ setStrat(r); setLoading(false); clearInterval(t); setStep(STEPS.length-1); })
      .catch(()=>{ setStrat("Erro ao gerar. Verifique sua conexão."); setLoading(false); });
    return ()=>clearInterval(t);
  },[]);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex",
      alignItems:"center", justifyContent:"center", zIndex:10006, padding:20, backdropFilter:"blur(12px)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:C.card, border:`1px solid ${C.purple}40`, borderRadius:22, padding:"24px 26px",
        maxWidth:520, width:"100%", maxHeight:"90vh", overflowY:"auto",
        boxShadow:`0 32px 80px rgba(0,0,0,0.7), 0 0 40px ${C.purpleGlow}`,
        animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:`${C.purple}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Sparkles size={14} color={C.purple}/>
              </div>
              <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", color:C.purple, fontWeight:700 }}>✨ Estratégia IA</span>
            </div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, margin:0, color:C.text }}>{lead.name}</h3>
            <p style={{ color:C.muted, fontSize:12, margin:"2px 0 0" }}>{lead.product} · R${lead.value}</p>
          </div>
          <button onClick={onClose} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", borderRadius:8, padding:6, display:"flex" }}><X size={16}/></button>
        </div>

        {loading ? (
          <div style={{ padding:"32px 0" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {STEPS.map((s,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, opacity:i<=step?1:0.25, transition:"opacity 0.4s" }}>
                  <div style={{ width:28, height:28, borderRadius:8, flexShrink:0,
                    background:i<step?`${C.green}20`:i===step?`${C.purple}20`:C.surface,
                    border:`1px solid ${i<step?C.green:i===step?C.purple:C.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {i<step ? <Check size={13} color={C.green}/> : i===step ? <Loader2 size={13} color={C.purple} style={{ animation:"spin 0.8s linear infinite" }}/> : <span style={{ fontSize:10, color:C.muted }}>{i+1}</span>}
                  </div>
                  <span style={{ fontSize:13.5, color:i<=step?C.text:C.muted, fontWeight:i===step?600:400 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {strat.split(/\d\.\s+/).filter(Boolean).map((part, i) => {
              const labels = ["🔍 Diagnóstico","🎯 Abordagem","💬 Script de Fechamento"];
              const colors = [C.amber, C.neon, C.green];
              return (
                <div key={i} style={{ background:C.surface, border:`1px solid ${colors[i]||C.border}30`, borderRadius:12, padding:"14px 16px" }}>
                  <span style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:colors[i]||C.muted, display:"block", marginBottom:8 }}>{labels[i]||`Parte ${i+1}`}</span>
                  <p style={{ fontSize:13.5, lineHeight:1.7, margin:0, color:C.text }}>{part.trim()}</p>
                </div>
              );
            })}
            <button onClick={()=>{ clip(strat); showToast("Estratégia copiada!","success"); }}
              style={{ width:"100%", background:`${C.purple}15`, border:`1px solid ${C.purple}40`, color:C.purple,
                fontWeight:700, fontSize:13, padding:"11px", borderRadius:10, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <Copy size={14}/> Copiar Estratégia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ RECUPERAÇÃO */
function RecuperacaoScreen({ user, setUser, setScreen, showToast, onXP, onMenuToggle }) {
  const leads = user.leads || [];
  const emRisco     = leads.filter(l=>l.lastContact>=14);
  const perdidos    = leads.filter(l=>l.lastContact>=8&&l.lastContact<14);
  const recuperados = leads.filter(l=>l.status==="Ativo");

  const [tab, setTab]             = useState("risco");
  const [modal, setModal]         = useState(null);
  const [waModal, setWaModal]     = useState(null);
  const [stratModal, setStratModal] = useState(null);
  const [iaMsg, setIaMsg]         = useState("");
  const [iaFup, setIaFup]         = useState("");
  const [iaStrat, setIaStrat]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [loadStep, setLoadStep]   = useState(0);
  const [waCount, setWaCount]     = useState(() => getWASendCount(user.uid||user.name));
  const [seqModal, setSeqModal]   = useState(false);

  // refresh waCount when waModal closes
  function handleWaModalClose() { setWaModal(null); setWaCount(getWASendCount(user.uid||user.name)); }

  const LOAD_STEPS = ["Analisando cliente...", "Identificando objeções...", "Montando estratégia...", "Gerando resposta..."];

  async function recuperarAgora(lead) {
    setModal(lead); setIaMsg(""); setIaFup(""); setIaStrat(""); setLoading(true); setLoadStep(0);
    let si = 0;
    const timer = setInterval(()=>{ si = Math.min(si+1, LOAD_STEPS.length-1); setLoadStep(si); }, 900);
    try {
      const sys = `Recovery IA, nicho ${NICHE_LABEL[user.niche]}. Responda EXATAMENTE em 3 seções separadas:
MENSAGEM: (uma mensagem WhatsApp curta, direta, personalizada)
FOLLOWUP: (uma mensagem de follow-up para 2 dias depois)
ESTRATEGIA: (2-3 dicas específicas de abordagem para este lead)
Português, sem markdown, sem asteriscos.`;
      const text = await callIA(sys, [{ role:"user", content:`Lead: ${lead.name}. Produto: ${lead.product}. Valor: R$${lead.value}. Dias sem contato: ${lead.lastContact}. Obs: ${lead.obs||"sem info"}` }]);
      const m = text.match(/MENSAGEM:([\s\S]*?)(?:FOLLOWUP:|$)/i);
      const f = text.match(/FOLLOWUP:([\s\S]*?)(?:ESTRATEGIA:|$)/i);
      const s = text.match(/ESTRATEGIA:([\s\S]*?)$/i);
      setIaMsg(m?m[1].trim()+IA_DISCLAIMER:""); setIaFup(f?f[1].trim()+IA_DISCLAIMER:""); setIaStrat(s?s[1].trim():"");
    } catch { setIaMsg("Erro ao gerar. Tente novamente."); }
    finally { clearInterval(timer); setLoadStep(LOAD_STEPS.length-1); setLoading(false); }
  }

  function markRecovered(lead) {
    setUser(u=>({...u, xp:u.xp+200,
      leads:u.leads.map(l=>l.id===lead.id?{...l,status:"Ativo",lastContact:0,vacuum:5}:l),
      achievements:u.achievements.includes("recuperador")?u.achievements:[...u.achievements,"recuperador"]
    }));
    onXP(200); showToast("✅ Cliente recuperado! +200 XP","success"); setModal(null);
  }

  const urgencyMap = { "Em Risco":"hot","Esfriando":"cold","Atenção":"warn","Ativo":"ready" };
  const tabs = [
    { id:"risco", label:"Clientes em Risco", data:emRisco,    color:C.red,    icon:"🔴" },
    { id:"frios", label:"Clientes Perdidos",  data:perdidos,   color:C.orange, icon:"🔥" },
    { id:"ok",    label:"Recuperados",        data:recuperados,color:C.green,  icon:"✅" },
  ];
  const currentTab = tabs.find(t=>t.id===tab);

  const emptyMessages = {
    risco: { icon:"🛡️", title:"Nenhum cliente em risco.", sub:"Ótimo trabalho. Sua operação está protegida." },
    frios: { icon:"🔥", title:"Nenhum lead perdido no momento.", sub:"Continue engajando seus clientes para manter essa posição." },
    ok:    { icon:"🏆", title:"Nenhum cliente recuperado ainda.", sub:"Use a Central de Recuperação para reativar leads parados." },
  };

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle} title="Central de Recuperação"
        sub="Reative, reconquiste e feche clientes parados" waCount={waCount}/>

      {/* Tab bar + Sequências button */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:8, background:C.card, border:`1px solid ${C.border}`,
          padding:6, borderRadius:12, flexWrap:"wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{ padding:"8px 16px", borderRadius:8, border:"none", fontSize:12.5, fontWeight:700,
                background:tab===t.id?`${t.color}20`:"transparent",
                color:tab===t.id?t.color:C.muted, cursor:"pointer", transition:"all 0.15s",
                boxShadow:tab===t.id?`0 0 12px ${t.color}30`:"none" }}>
              {t.icon} {t.label} <span style={{ fontSize:11, opacity:0.7 }}>({t.data.length})</span>
            </button>
          ))}
        </div>
        <button onClick={()=>setSeqModal(true)}
          style={{ display:"flex", alignItems:"center", gap:7, background:`${C.purple}15`,
            border:`1px solid ${C.purple}35`, color:C.purple, borderRadius:10, padding:"9px 15px",
            fontSize:12.5, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
          <List size={14}/> 🔁 Sequências Prontas
        </button>
      </div>

      {/* Upgrade inline — Ouro only */}
      {user.plan !== "DIAMANTE" && (
        <div style={{ marginBottom:16, padding:"12px 16px", borderRadius:10,
          background:`linear-gradient(135deg,rgba(124,58,237,0.07),rgba(0,212,255,0.04))`,
          border:`1px solid ${C.purple}25`, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <Gem size={14} color={C.purple}/>
          <span style={{ fontSize:12, color:C.muted, flex:1 }}>
            Quer respostas mais rápidas e apoio em tempo real? <span style={{ color:C.purple, fontWeight:700 }}>Veja o Plano Diamante.</span>
          </span>
          <button onClick={()=>{ setUser(u=>({...u,plan:"DIAMANTE"})); showToast("Plano Diamante ativado! 💠","success"); }}
            style={{ background:`linear-gradient(135deg,${C.purple},${C.neon})`, color:"#fff",
              border:"none", fontWeight:700, fontSize:11.5, padding:"7px 14px", borderRadius:7, cursor:"pointer",
              boxShadow:`0 3px 12px ${C.purpleGlow}`, flexShrink:0, whiteSpace:"nowrap" }}>
            💠 Ver Diamante
          </button>
        </div>
      )}

      {/* Lead cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {currentTab?.data.map(l => {
          const vc = getVC(l.lastContact);
          return (
            <GlassCard key={l.id} style={{ padding:"16px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                <div style={{ width:46, height:46, borderRadius:12, background:vc.bg,
                  border:`1px solid ${vc.color}30`, display:"flex", alignItems:"center",
                  justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:800, color:vc.color }}>{l.vacuum}%</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{l.name}</span>
                    <AlertBadge type={urgencyMap[l.status]||"warn"}/>
                  </div>
                  <div style={{ display:"flex", gap:12, marginTop:4, flexWrap:"wrap" }}>
                    <span style={{ fontSize:12, color:C.muted }}>{l.product}</span>
                    <span style={{ fontSize:12, color:C.amber, fontWeight:600 }}>R${l.value}</span>
                    <span style={{ fontSize:12, color:vc.color }}>{l.lastContact}d sem resposta</span>
                  </div>
                  {l.obs && <p style={{ fontSize:11.5, color:C.muted, margin:"5px 0 0", fontStyle:"italic" }}>"{l.obs}"</p>}
                </div>
                <div className="recovery-actions" style={{ display:"flex", gap:7, flexShrink:0, flexWrap:"wrap", alignItems:"center" }}>
                  {tab !== "ok" && (
                    <button onClick={()=>recuperarAgora(l)}
                      style={{ display:"flex", alignItems:"center", gap:6, background:`linear-gradient(135deg,${C.neon},${C.purple})`,
                        color:"#fff", border:"none", borderRadius:9, padding:"9px 14px", fontSize:12, fontWeight:700,
                        cursor:"pointer", boxShadow:`0 4px 14px ${C.neonGlow}`, whiteSpace:"nowrap" }}>
                      🔥 Recuperar Agora
                    </button>
                  )}
                  <button onClick={()=>setWaModal(l)}
                    style={{ display:"flex", alignItems:"center", gap:5, background:`${C.green}15`,
                      border:`1px solid ${C.green}35`, color:C.green, borderRadius:9, padding:"9px 12px",
                      fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                    <MessageCircle size={13}/> 💬 WhatsApp
                  </button>
                  {tab !== "ok" && (
                    <button onClick={()=>setStratModal(l)}
                      style={{ display:"flex", alignItems:"center", gap:5, background:`${C.purple}12`,
                        border:`1px solid ${C.purple}30`, color:C.purple, borderRadius:9, padding:"9px 12px",
                        fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                      <Sparkles size={13}/> ✨ Estratégia
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}

        {currentTab?.data.length === 0 && (
          <div style={{ textAlign:"center", padding:"72px 32px", animation:"fadeInUp 0.5s ease" }}>
            <div style={{ width:72, height:72, borderRadius:20, background:`${C.green}10`,
              border:`1px solid ${C.green}20`, display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 20px", fontSize:36 }}>
              {emptyMessages[tab]?.icon}
            </div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700,
              color:C.text, margin:"0 0 8px" }}>{emptyMessages[tab]?.title}</h3>
            <p style={{ color:C.muted, fontSize:13.5, margin:0, lineHeight:1.6 }}>{emptyMessages[tab]?.sub}</p>
            {tab !== "ok" && (
              <div style={{ marginTop:20, display:"inline-flex", alignItems:"center", gap:7, padding:"6px 14px",
                background:`${C.green}10`, border:`1px solid ${C.green}25`, borderRadius:100 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }}/>
                <span style={{ fontSize:11.5, color:C.green, fontWeight:600 }}>Operação Protegida</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recovery Modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex",
          alignItems:"center", justifyContent:"center", zIndex:9999, padding:20, backdropFilter:"blur(10px)" }}
          onClick={e=>{ if(e.target===e.currentTarget) setModal(null); }}>
          <div style={{ background:C.card, border:`1px solid ${C.borderHi}`, borderRadius:20, padding:"26px 28px",
            maxWidth:520, width:"100%", maxHeight:"90vh", overflowY:"auto",
            boxShadow:`0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(79,110,247,0.1)`,
            animation:"popIn 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", color:C.neon, fontWeight:700, marginBottom:4 }}>Recuperação IA</div>
                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, margin:0, color:C.text }}>{modal.name}</h3>
                <p style={{ color:C.muted, fontSize:12, margin:"3px 0 0" }}>{modal.product} · R${modal.value} · {modal.lastContact} dias sem resposta</p>
              </div>
              <button onClick={()=>setModal(null)} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", borderRadius:8, padding:6, display:"flex" }}><X size={16}/></button>
            </div>

            {loading ? (
              <div style={{ padding:"32px 0" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {LOAD_STEPS.map((s,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:12, opacity:i<=loadStep?1:0.25, transition:"opacity 0.4s ease" }}>
                      <div style={{ width:28, height:28, borderRadius:8, flexShrink:0,
                        background:i<loadStep?`${C.green}20`:i===loadStep?`${C.neon}20`:C.surface,
                        border:`1px solid ${i<loadStep?C.green:i===loadStep?C.neon:C.border}`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {i<loadStep ? <Check size={13} color={C.green}/> : i===loadStep ? <Loader2 size={13} color={C.neon} style={{ animation:"spin 0.8s linear infinite" }}/> : <span style={{ fontSize:10, color:C.muted }}>{i+1}</span>}
                      </div>
                      <span style={{ fontSize:13.5, color:i<=loadStep?C.text:C.muted, fontWeight:i===loadStep?600:400 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {iaMsg && (
                  <div style={{ background:C.surface, border:`1px solid ${C.neon}30`, borderRadius:12, padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                      <span style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:C.neon }}>📩 Mensagem de Recuperação</span>
                      <button onClick={()=>{ clip(iaMsg); showToast("Copiado!","success"); }}
                        style={{ background:`${C.neon}15`, border:`1px solid ${C.neon}30`, color:C.neon, borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                        <Copy size={11}/> Copiar
                      </button>
                    </div>
                    <p style={{ fontSize:13.5, lineHeight:1.7, margin:0, color:C.text }}>{iaMsg}</p>
                  </div>
                )}
                {iaFup && (
                  <div style={{ background:C.surface, border:`1px solid ${C.purple}30`, borderRadius:12, padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                      <span style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:C.purple }}>⚡ Follow-Up IA (Dia 2)</span>
                      <button onClick={()=>{ clip(iaFup); showToast("Copiado!","success"); }}
                        style={{ background:`${C.purple}15`, border:`1px solid ${C.purple}30`, color:C.purple, borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                        <Copy size={11}/> Copiar
                      </button>
                    </div>
                    <p style={{ fontSize:13.5, lineHeight:1.7, margin:0, color:C.text }}>{iaFup}</p>
                  </div>
                )}
                {iaStrat && (
                  <div style={{ background:C.surface, border:`1px solid ${C.amber}30`, borderRadius:12, padding:"14px 16px" }}>
                    <span style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:C.amber, display:"block", marginBottom:8 }}>🎯 Estratégia de Recuperação</span>
                    <p style={{ fontSize:13, lineHeight:1.7, margin:0, color:C.muted }}>{iaStrat}</p>
                  </div>
                )}
                <div style={{ display:"flex", gap:10, marginTop:4, flexWrap:"wrap" }}>
                  <button onClick={()=>{ setModal(null); setWaModal(modal); }}
                    style={{ flex:1, minWidth:140, background:`${C.green}18`, border:`1px solid ${C.green}40`, color:C.green,
                      fontWeight:700, fontSize:13, padding:"11px", borderRadius:9, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                    <MessageCircle size={14}/> 💬 Gerar Mensagem
                  </button>
                  <button onClick={()=>markRecovered(modal)}
                    style={{ flex:1, minWidth:140, background:`linear-gradient(135deg,${C.green},${C.cyan})`, color:"#000",
                      border:"none", fontWeight:700, fontSize:13, padding:"11px", borderRadius:9, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                      boxShadow:`0 4px 16px ${C.greenGlow}` }}>
                    <CheckCircle size={14}/> Marcar Recuperado +200 XP
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {waModal && <WhatsAppModal lead={waModal} onClose={handleWaModalClose} showToast={showToast} userId={user.uid||user.name}/>}

      {/* Strategy Modal */}
      {stratModal && <IAStrategyModal lead={stratModal} niche={user.niche} onClose={()=>setStratModal(null)} showToast={showToast}/>}

      {/* Sequências Prontas Modal */}
      {seqModal && <SequenciasModal onClose={()=>setSeqModal(false)} showToast={showToast}/>}
    </div>
  );
}

/* ═══════════════════════════════════ SEQUÊNCIAS PRONTAS MODAL */
function SequenciasModal({ onClose, showToast }) {
  const [selected, setSelected] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [leadName, setLeadName] = useState("{nome}");
  const [leadProduct, setLeadProduct] = useState("{produto}");

  function resolveText(text) {
    return text.replace(/\{nome\}/g, leadName||"{nome}").replace(/\{produto\}/g, leadProduct||"{produto}");
  }

  function copyMsg(text, key) {
    clip(resolveText(text), ()=>{
      setCopiedKey(key);
      showToast("Mensagem copiada!","success");
      setTimeout(()=>setCopiedKey(null),2000);
    });
  }

  const dayColors = { "D+0":C.neon, "D+1":C.amber, "D+3":C.orange, "D+7":C.red };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex",
      alignItems:"center", justifyContent:"center", zIndex:10007, padding:20, backdropFilter:"blur(12px)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:C.card, border:`1px solid ${C.purple}40`, borderRadius:22, padding:"24px 26px",
        maxWidth:640, width:"100%", maxHeight:"92vh", overflowY:"auto",
        boxShadow:`0 32px 80px rgba(0,0,0,0.7), 0 0 40px ${C.purpleGlow}`,
        animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:`${C.purple}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <List size={14} color={C.purple}/>
              </div>
              <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", color:C.purple, fontWeight:700 }}>🔁 Sequências Anti-Sumiço</span>
            </div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, margin:0, color:C.text }}>10 Sequências Prontas</h3>
            <p style={{ color:C.muted, fontSize:12, margin:"2px 0 0" }}>Escolha a situação e copie cada mensagem no dia certo</p>
          </div>
          <button onClick={onClose} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", borderRadius:8, padding:6, display:"flex" }}><X size={16}/></button>
        </div>

        {/* Personalização rápida */}
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:140 }}>
            <label style={{ display:"block", fontSize:10, textTransform:"uppercase", letterSpacing:"0.05em", color:C.muted, marginBottom:4, fontWeight:700 }}>Nome do Lead</label>
            <input value={leadName} onChange={e=>setLeadName(e.target.value)} placeholder="Ex: João"
              style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, color:C.text,
                borderRadius:8, padding:"8px 11px", fontSize:13, outline:"none", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=C.neon} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          <div style={{ flex:1.5, minWidth:180 }}>
            <label style={{ display:"block", fontSize:10, textTransform:"uppercase", letterSpacing:"0.05em", color:C.muted, marginBottom:4, fontWeight:700 }}>Produto/Serviço</label>
            <input value={leadProduct} onChange={e=>setLeadProduct(e.target.value)} placeholder="Ex: consultoria, plano mensal..."
              style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, color:C.text,
                borderRadius:8, padding:"8px 11px", fontSize:13, outline:"none", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=C.neon} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
        </div>

        {/* Sequence selector */}
        {!selected ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {SEQUENCIAS_PRONTAS.map(seq=>(
              <button key={seq.id} onClick={()=>setSelected(seq)}
                style={{ textAlign:"left", background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px",
                  cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.purple+"60"; e.currentTarget.style.background=`${C.purple}08`; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface; }}>
                <div style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:4 }}>{seq.label}</div>
                <div style={{ fontSize:11, color:C.muted }}>{seq.desc}</div>
                <div style={{ display:"flex", gap:4, marginTop:8, flexWrap:"wrap" }}>
                  {seq.msgs.map(m=>(
                    <span key={m.day} style={{ fontSize:9.5, fontWeight:700, color:dayColors[m.day]||C.neon,
                      background:`${dayColors[m.day]||C.neon}15`, padding:"2px 7px", borderRadius:100,
                      border:`1px solid ${dayColors[m.day]||C.neon}30` }}>{m.day}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={()=>setSelected(null)}
              style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:"none",
                color:C.muted, fontSize:12.5, cursor:"pointer", marginBottom:14, padding:0 }}>
              <ArrowLeft size={13}/> Voltar às sequências
            </button>
            <div style={{ marginBottom:14, padding:"12px 14px", background:`${C.purple}08`, border:`1px solid ${C.purple}25`, borderRadius:10 }}>
              <div style={{ fontSize:15, fontWeight:800, color:C.purple }}>{selected.label}</div>
              <div style={{ fontSize:11.5, color:C.muted, marginTop:2 }}>{selected.desc}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {selected.msgs.map((msg, i)=>{
                const dayColor = dayColors[msg.day]||C.neon;
                const key = `${selected.id}-${i}`;
                return (
                  <div key={i} style={{ background:C.surface, border:`1px solid ${dayColor}30`, borderRadius:12, padding:"13px 15px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:11, fontWeight:800, color:dayColor,
                          background:`${dayColor}15`, padding:"3px 9px", borderRadius:100, border:`1px solid ${dayColor}30` }}>{msg.day}</span>
                        <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{msg.label}</span>
                      </div>
                      <button onClick={()=>copyMsg(msg.text, key)}
                        style={{ background:`${C.neon}12`, border:`1px solid ${C.neon}25`, color:C.neon,
                          borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                        {copiedKey===key ? <><Check size={10}/> Copiado!</> : <><Copy size={10}/> Copiar</>}
                      </button>
                    </div>
                    <p style={{ fontSize:12.5, lineHeight:1.65, margin:0, color:C.muted }}>
                      {resolveText(msg.text)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ CLOSER LOADING STEPS */
function CloserLoadingSteps() {
  const STEPS = ["Analisando cliente...", "Identificando objeções...", "Montando estratégia...", "Gerando resposta..."];
  const [step, setStep] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>setStep(p=>Math.min(p+1, STEPS.length-1)), 900);
    return ()=>clearInterval(t);
  },[]);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, padding:"10px 14px",
      background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, width:"fit-content", maxWidth:260 }}>
      {STEPS.map((s,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:9,
          opacity:i<=step?1:0.25, transition:"opacity 0.4s ease" }}>
          <div style={{ width:20, height:20, borderRadius:6, flexShrink:0,
            background:i<step?`${C.green}20`:i===step?`${C.neon}20`:C.card,
            border:`1px solid ${i<step?C.green:i===step?C.neon:C.border}`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            {i<step
              ? <Check size={11} color={C.green}/>
              : i===step
                ? <Loader2 size={11} color={C.neon} style={{ animation:"spin 0.8s linear infinite" }}/>
                : <span style={{ fontSize:8, color:C.muted }}>{i+1}</span>}
          </div>
          <span style={{ fontSize:12, color:i<=step?C.text:C.muted, fontWeight:i===step?600:400 }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════ CLOSER IA */
function CloserScreen({ user, setUser, showToast, onXP, onMenuToggle }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", content:`Olá! Sou o Closer IA especializado em ${NICHE_LABEL[user.niche]}. Cole a mensagem do lead ou escolha uma objeção comum para eu gerar a resposta ideal de fechamento.` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiUsage, setAiUsage] = useState(() => getAIUsage(user.uid || user.name));
  const scrollRef = useRef(null);
  const sys = `Você é Closer IA, especialista em fechamento de vendas pelo WhatsApp, nicho ${NICHE_LABEL[user.niche]}. Responda em português brasileiro, de forma direta e persuasiva, 2-4 frases, pronto para colar no WhatsApp. Sempre direcione para um próximo passo concreto de fechamento. Sem markdown, sem asteriscos.`;

  const limitReached = aiUsage >= AI_DAILY_LIMIT;

  useEffect(()=>{ if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight; },[msgs,loading]);

  async function send(text) {
    if (limitReached) {
      showToast("Limite diário de consultas atingido! 🚫","warning");
      return;
    }
    const next = [...msgs, { role:"user", content:text }];
    setMsgs(next); setInput(""); setLoading(true);
    try {
      const reply = await callGroqIA(sys, next.slice(-10));
      setMsgs(p=>[...p, { role:"assistant", content:reply }]);
      const newCount = incrementAIUsage(user.uid || user.name);
      setAiUsage(newCount);
      setUser(u=>({...u,xp:u.xp+10})); onXP(10);
    } catch { setMsgs(p=>[...p, { role:"assistant", content:"Não rolou. Tente novamente." }]); }
    finally { setLoading(false); }
  }

  const lastAss = [...msgs].reverse().find(m=>m.role==="assistant");

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle} title="Closer IA" sub="Análise de objeções e fechamento inteligente"/>

      <div className="ia-split-layout" style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:14, height:560 }}>
        {/* Objections panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:6, overflowY:"auto" }}>
          <p style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.07em", color:C.muted, margin:"0 0 6px", fontWeight:700 }}>Objeções Comuns</p>
          {OBJECTIONS[user.niche].map(o => (
            <button key={o.obj} disabled={loading || limitReached} onClick={()=>send(o.obj)}
              style={{ textAlign:"left", background:C.card, border:`1px solid ${C.border}`, color:C.muted,
                fontSize:12, padding:"10px 12px", borderRadius:10, lineHeight:1.4, cursor: loading || limitReached ? "not-allowed" : "pointer",
                opacity:loading || limitReached ? 0.35 : 1, transition:"all 0.15s" }}
              onMouseEnter={e=>{ if(!loading && !limitReached){e.currentTarget.style.borderColor=C.neon+"60"; e.currentTarget.style.color=C.text; e.currentTarget.style.background=`${C.neon}08`; }}}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.muted; e.currentTarget.style.background=C.card; }}>
              <span style={{ fontSize:9.5, color: limitReached ? C.muted : C.neon, display:"block", marginBottom:2, fontWeight:700, textTransform:"uppercase" }}>{o.cat}</span>
              {o.obj}
            </button>
          ))}
        </div>

        {/* Chat panel */}
        <GlassCard noPad style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:32, height:32, borderRadius:9, background:`linear-gradient(135deg,${C.neon},${C.purple})`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <MessageSquareText size={15} color="#fff"/>
            </div>
            <div>
              <span style={{ fontWeight:700, fontSize:13.5, color:C.text }}>Closer IA</span>
              <div style={{ fontSize:10.5, color:C.muted }}>Especialista {NICHE_LABEL[user.niche]}</div>
            </div>
            <div className="ia-counter-row" style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
              {/* Contador de consultas */}
              <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px",
                background: limitReached ? `${C.red}18` : `${C.amber}12`,
                border:`1px solid ${limitReached ? C.red : C.amber}30`, borderRadius:100 }}>
                <Zap size={11} color={limitReached ? C.red : C.amber}/>
                <span style={{ fontSize:10.5, fontWeight:700, fontFamily:"monospace",
                  color: limitReached ? C.red : C.amber }}>
                  {aiUsage}/{AI_DAILY_LIMIT}
                </span>
                <span className="ia-counter-label" style={{ fontSize:9.5, color:C.muted }}>consultas IA</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px",
                background: limitReached ? `${C.red}12` : `${C.green}12`,
                border:`1px solid ${limitReached ? C.red : C.green}30`, borderRadius:100 }}>
                <span style={{ width:6, height:6, borderRadius:"50%",
                  background: limitReached ? C.red : C.green,
                  animation: limitReached ? "none" : "pulse 2s infinite",
                  boxShadow:`0 0 6px ${limitReached ? C.red : C.green}` }}/>
                <span style={{ fontSize:10.5, color: limitReached ? C.red : C.green, fontWeight:600 }}>
                  {limitReached ? "Limite atingido" : "Online"}
                </span>
              </div>
            </div>
          </div>

          <div ref={scrollRef} style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 }}>
            {msgs.map((m,i) => (
              <div key={i} style={{ maxWidth:"82%", padding:"11px 14px", borderRadius:14, fontSize:13.5, lineHeight:1.6,
                background:m.role==="assistant"?C.surface:`linear-gradient(135deg,${C.neon},${C.purple})`,
                color:m.role==="assistant"?C.text:"#fff",
                alignSelf:m.role==="assistant"?"flex-start":"flex-end",
                borderBottomLeftRadius:m.role==="assistant"?3:14,
                borderBottomRightRadius:m.role==="user"?3:14,
                border:`1px solid ${m.role==="assistant"?C.border:"transparent"}`,
                boxShadow:m.role==="user"?`0 4px 14px ${C.neonGlow}`:"none",
                animation:"popIn 0.2s ease" }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <CloserLoadingSteps/>
            )}
          </div>

          {lastAss && msgs.length > 1 && (
            <div style={{ padding:"8px 16px", borderTop:`1px solid ${C.border}` }}>
              <button onClick={()=>{ clip(lastAss.content); showToast("Copiado!","success"); }}
                style={{ fontSize:12, padding:"6px 12px", borderRadius:7, cursor:"pointer",
                  background:`${C.cyan}12`, color:C.cyan, border:`1px solid ${C.cyan}30`,
                  display:"flex", alignItems:"center", gap:5 }}>
                <Copy size={11}/> Copiar última resposta
              </button>
            </div>
          )}

          {limitReached && (
            <div style={{ padding:"14px 18px", borderTop:`1px solid ${C.red}25`,
              background:`${C.red}08`, display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:`${C.red}18`,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <AlertTriangle size={14} color={C.red}/>
                </div>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:700, color:C.red }}>Limite diário atingido 🚫</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>
                    Você usou todas as {AI_DAILY_LIMIT} consultas de hoje. O limite renova à meia-noite. Volte amanhã! 😊
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={{ display:"flex", gap:8, padding:"12px 16px", borderTop:`1px solid ${C.border}`, opacity: limitReached ? 0.45 : 1 }}>
            <input value={input} onChange={e=>{ if(!limitReached) setInput(e.target.value); }}
              placeholder={limitReached ? "Limite de consultas atingido para hoje..." : "Cole a mensagem do lead ou descreva a objeção..."}
              disabled={loading || limitReached}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey&&input.trim()&&!loading&&!limitReached){e.preventDefault();send(input.trim());} }}
              style={{ flex:1, background:C.surface, border:`1px solid ${limitReached ? C.red+"40" : C.border}`, color:C.text,
                borderRadius:10, padding:"11px 14px", fontSize:13.5, outline:"none", fontFamily:"'Inter',sans-serif",
                cursor: limitReached ? "not-allowed" : "text" }}
              onFocus={e=>{ if(!limitReached) e.target.style.borderColor=C.neon; }}
              onBlur={e=>e.target.style.borderColor= limitReached ? C.red+"40" : C.border}/>
            <button onClick={()=>{ if(input.trim()&&!loading&&!limitReached) send(input.trim()); }}
              disabled={loading||!input.trim()||limitReached}
              style={{ background: limitReached ? C.subtle : `linear-gradient(135deg,${C.neon},${C.purple})`, color:"#fff", border:"none",
                borderRadius:10, width:44, display:"flex", alignItems:"center", justifyContent:"center",
                cursor: loading||!input.trim()||limitReached ? "not-allowed" : "pointer",
                opacity:loading||!input.trim()||limitReached?0.4:1, boxShadow: limitReached ? "none" : `0 4px 12px ${C.neonGlow}` }}>
              <Send size={15}/>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ GAMIFICAÇÃO */
function GamificacaoScreen({ user, setUser, showToast, onXP, onMenuToggle }) {
  const { current, next } = getRank(user.xp);
  const span = next ? next.min - current.min : 1;
  const pct  = next ? Math.min(100,((user.xp-current.min)/span)*100) : 100;
  const unlocked = user.achievements || [];

  const leaderboard = [
    { pos:1, name:"Felipe M.", xp:8420, rank:"Elite",  emoji:"👑" },
    { pos:2, name:"Thais R.",  xp:6100, rank:"Elite",  emoji:"👑" },
    { pos:3, name:"Carlos V.", xp:4880, rank:"Especialista", emoji:"💎" },
    { pos:4, name:user.name,   xp:user.xp, rank:current.name, emoji:current.emoji, isMe:true },
    { pos:5, name:"João P.",   xp:920,  rank:"Operador",emoji:"🔥" },
  ].sort((a,b)=>b.xp-a.xp).map((e,i)=>({...e,pos:i+1}));

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle} title="Gamificação" sub="Seu progresso, conquistas e ranking"/>

      <div className="gamif-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Rank card */}
        <GlassCard glow="neon" style={{ background:`linear-gradient(135deg,${current.color}10, ${C.card})` }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <p style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", color:C.muted, margin:"0 0 4px", fontWeight:700 }}>Rank Atual</p>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:800, margin:0,
                color:current.color, textShadow:`0 0 24px ${current.color}60` }}>{current.emoji} {current.name}</h2>
            </div>
            <div style={{ fontFamily:"monospace", fontSize:13, color:C.amber, fontWeight:700,
              background:`${C.amber}15`, padding:"6px 12px", borderRadius:100, border:`1px solid ${C.amber}30` }}>
              ⚡ {user.xp} XP
            </div>
          </div>
          <div style={{ height:8, background:C.subtle, borderRadius:100, overflow:"hidden", marginBottom:8 }}>
            <div style={{ height:"100%", background:`linear-gradient(90deg,${current.color},${C.neon})`,
              width:`${pct}%`, transition:"width 1s ease", borderRadius:100,
              boxShadow:`0 0 16px ${current.color}60` }}/>
          </div>
          <p style={{ fontSize:11, color:C.muted, margin:"0 0 20px", fontFamily:"monospace" }}>
            {next?`${user.xp} / ${next.min} XP — faltam ${next.min-user.xp} XP para ${next.emoji} ${next.name}`:"🏆 Rank máximo!"}
          </p>
          {/* All ranks */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {RANKS.map(r => {
              const reached = user.xp >= r.min;
              return (
                <div key={r.name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"10px 12px",
                  borderRadius:12, background:reached?`${r.color}12`:C.surface,
                  border:`1px solid ${reached?r.color+"40":C.border}`,
                  opacity:reached?1:0.35, transition:"all 0.3s",
                  boxShadow:current.name===r.name?`0 0 20px ${r.color}40`:"none",
                  transform:current.name===r.name?"scale(1.05)":"scale(1)" }}>
                  <span style={{ fontSize:20 }}>{r.emoji}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:reached?r.color:C.muted }}>{r.name}</span>
                  <span style={{ fontSize:9, color:C.muted, fontFamily:"monospace" }}>{r.min>0?r.min+" XP":"START"}</span>
                  {!reached && <Lock size={9} color={C.muted}/>}
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Leaderboard */}
        <GlassCard noPad>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8 }}>
            <Trophy size={15} color={C.amber}/>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:700, color:C.text }}>Ranking Global</span>
          </div>
          <div style={{ padding:"8px 12px", display:"flex", flexDirection:"column", gap:4 }}>
            {leaderboard.map((e,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10,
                background:e.isMe?`${C.neon}12`:i===0?`${C.amber}08`:"transparent",
                border:`1px solid ${e.isMe?C.neon+"40":i===0?C.amber+"30":C.border}`,
                transition:"all 0.15s" }}>
                <span style={{ width:26, height:26, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                  background:i===0?C.amber:i===1?"#C0C0C0":i===2?"#CD7F32":C.subtle,
                  color:i<3?"#000":C.muted, fontSize:11, fontWeight:800, flexShrink:0 }}>
                  {i<3?["🥇","🥈","🥉"][i]:e.pos}
                </span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:e.isMe?700:500, color:e.isMe?C.neon:C.text }}>
                    {e.name} {e.isMe&&<span style={{ fontSize:10, color:C.neon }}>(você)</span>}
                  </div>
                  <div style={{ fontSize:10.5, color:C.muted }}>{e.emoji} {e.rank}</div>
                </div>
                <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color:i===0?C.amber:C.muted }}>⚡{e.xp}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Achievements grid */}
      <GlassCard noPad>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
          <p style={{ fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.07em", color:C.muted, margin:0, fontWeight:700 }}>
            Conquistas — {unlocked.length}/{ACHIEVEMENTS.length} desbloqueadas
          </p>
        </div>
        <div style={{ padding:"16px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
          {ACHIEVEMENTS.map(a => {
            const has = unlocked.includes(a.id);
            return (
              <div key={a.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderRadius:12,
                background:has?`${C.amber}08`:C.surface,
                border:`1px solid ${has?C.amber+"40":C.border}`,
                opacity:has?1:0.4, transition:"all 0.3s",
                boxShadow:has?`0 4px 20px ${C.amberGlow}`:"none" }}>
                <span style={{ fontSize:28, flexShrink:0 }}>{a.emoji}</span>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:700, color:has?C.amber:C.muted }}>{a.name}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{a.desc}</div>
                  <div style={{ fontSize:10, color:has?C.green:C.muted, marginTop:3, fontFamily:"monospace" }}>
                    {has?"✅ Conquistado":`+${a.xp} XP ao desbloquear`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

/* ═══════════════════════════════════ TREINAMENTOS */
function TreinamentosScreen({ user, setUser, showToast, onXP, onMenuToggle }) {
  const [completed, setCompleted] = useState([]);
  const levelColors = { "Básico":C.green, "Intermediário":C.amber, "Avançado":C.red };

  function complete(t) {
    if (completed.includes(t.id)) { showToast("Já concluído","info"); return; }
    setCompleted(p=>[...p,t.id]);
    setUser(u=>({...u,xp:u.xp+t.xp}));
    onXP(t.xp);
    showToast(`Treinamento concluído! +${t.xp} XP`,"success");
  }

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle} title="Treinamentos" sub="Scripts, técnicas e masterclasses de fechamento"/>

      {/* Upgrade inline — Ouro only */}
      {user.plan !== "DIAMANTE" && (
        <div style={{ marginBottom:20, padding:"12px 16px", borderRadius:10,
          background:`linear-gradient(135deg,rgba(0,212,255,0.06),rgba(124,58,237,0.04))`,
          border:`1px solid ${C.cyan}25`, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <Sparkles size={14} color={C.cyan}/>
          <span style={{ fontSize:12, color:C.muted, flex:1 }}>
            Ative o copiloto de vendas em tempo real no <span style={{ color:C.cyan, fontWeight:700 }}>Plano Diamante</span> — Closer IA, Follow-Up IA e Relatórios Avançados.
          </span>
          <button onClick={()=>{ setUser(u=>({...u,plan:"DIAMANTE"})); showToast("Plano Diamante ativado! 💠","success"); }}
            style={{ background:`linear-gradient(135deg,${C.cyan},${C.neon})`, color:"#000",
              border:"none", fontWeight:700, fontSize:11.5, padding:"7px 14px", borderRadius:7, cursor:"pointer",
              boxShadow:`0 3px 12px ${C.cyanGlow}`, flexShrink:0, whiteSpace:"nowrap" }}>
            💠 Ver Diamante
          </button>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {TRAININGS.map(t => {
          const done = completed.includes(t.id);
          const lc = levelColors[t.level] || C.neon;
          return (
            <GlassCard key={t.id} glow={done?"green":null}
              style={{ background:done?`${C.green}06`:C.card, position:"relative", overflow:"hidden" }}>
              {done && (
                <div style={{ position:"absolute", top:12, right:12, width:24, height:24, borderRadius:"50%",
                  background:C.green, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Check size={13} color="#000"/>
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{ fontSize:10.5, fontWeight:700, color:lc, textTransform:"uppercase", letterSpacing:"0.06em",
                  background:`${lc}15`, padding:"3px 9px", borderRadius:100, border:`1px solid ${lc}30` }}>{t.level}</span>
                <span style={{ fontSize:11, color:C.muted, marginLeft:"auto" }}>⏱ {t.duration}</span>
              </div>
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:700, margin:"0 0 8px", color:C.text, lineHeight:1.3 }}>{t.title}</h3>
              <p style={{ fontSize:12.5, color:C.muted, margin:"0 0 18px", lineHeight:1.6 }}>{t.desc}</p>
              <button onClick={()=>complete(t)} disabled={done}
                style={{ width:"100%", background:done?C.surface:`linear-gradient(135deg,${C.neon},${C.purple})`,
                  color:done?C.muted:"#fff", border:done?`1px solid ${C.border}`:"none",
                  fontWeight:700, fontSize:13, padding:"11px", borderRadius:9, cursor:done?"not-allowed":"pointer",
                  transition:"all 0.2s", boxShadow:done?"none":`0 4px 14px ${C.neonGlow}` }}>
                {done ? "✅ Concluído" : `Iniciar Treinamento +${t.xp} XP`}
              </button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ RELATÓRIOS */
function RelatoriosScreen({ user, setScreen, onMenuToggle }) {
  const leads = user.leads || [];
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const now = new Date();
  const chartData = Array.from({length:6},(_,i)=>{
    const d = new Date(now.getFullYear(),now.getMonth()-5+i,1);
    return { month:months[d.getMonth()], leads:Math.round(3+Math.random()*8), conversions:Math.round(1+Math.random()*5) };
  });
  const maxL = Math.max(...chartData.map(d=>d.leads));

  const hasLeads = leads.length > 0;

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle} title="Relatórios" sub="Performance dos últimos 30 dias"/>

      {/* KPI summary */}
      <div className="metrics-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Taxa Conversão",   value:`${hasLeads?Math.round(leads.filter(l=>l.status==="Ativo").length/leads.length*100):0}%`, color:C.green, icon:Target },
          { label:"Ticket Médio",      value:`R$${hasLeads?Math.round(leads.reduce((s,l)=>s+l.value,0)/leads.length):0}`, color:C.amber, icon:DollarSign },
          { label:"Leads/Semana",      value:Math.ceil(leads.length/4)||0, color:C.neon, icon:TrendingUp },
          { label:"Score Vácuo",       value:`${hasLeads?Math.round(leads.reduce((s,l)=>s+l.vacuum,0)/leads.length):0}%`, color:C.red, icon:Activity },
        ].map(m=>{ const Icon=m.icon; return (
          <div key={m.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:`${m.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={13} color={m.color}/>
              </div>
              <span style={{ fontSize:10.5, color:C.muted, fontWeight:600 }}>{m.label}</span>
            </div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:800, color:m.color }}>{m.value}</div>
          </div>
        );})}
      </div>

      {!hasLeads ? (
        /* Premium empty state for Reports */
        <GlassCard>
          <div style={{ textAlign:"center", padding:"56px 32px", animation:"fadeInUp 0.5s ease" }}>
            <div style={{ width:72, height:72, borderRadius:20, background:`${C.neon}08`,
              border:`1px solid ${C.neon}18`, display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 20px" }}>
              <BarChart2 size={30} color={C.neon} opacity={0.4}/>
            </div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700,
              color:C.text, margin:"0 0 10px" }}>Nenhum dado para exibir ainda.</h3>
            <p style={{ color:C.muted, fontSize:13.5, margin:"0 0 8px", lineHeight:1.7, maxWidth:340, marginLeft:"auto", marginRight:"auto" }}>
              Adicione leads no CRM para começar a ver sua performance de recuperação de faturamento.
            </p>
            <p style={{ color:C.muted, fontSize:12, margin:"0 0 24px", fontStyle:"italic" }}>
              Os relatórios são gerados automaticamente conforme você usa o sistema.
            </p>
            <button onClick={()=>setScreen("crm")}
              style={{ background:`linear-gradient(135deg,${C.neon},${C.purple})`, color:"#fff",
                border:"none", borderRadius:10, padding:"11px 22px", fontSize:13, fontWeight:700,
                cursor:"pointer", boxShadow:`0 4px 16px ${C.neonGlow}`,
                display:"inline-flex", alignItems:"center", gap:7 }}>
              <Plus size={14}/> Adicionar Leads no CRM
            </button>
          </div>
        </GlassCard>
      ) : (
        /* Charts */
        <div className="reports-charts" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <GlassCard>
            <p style={{ fontSize:11.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:C.muted, margin:"0 0 20px" }}>Leads por Mês</p>
            <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
              {chartData.map((d,i)=>(
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:10, color:C.neon, fontFamily:"monospace", fontWeight:700 }}>{d.leads}</span>
                  <div style={{ width:"100%", borderRadius:"4px 4px 0 0",
                    height:`${(d.leads/maxL)*90}px`,
                    background:`linear-gradient(180deg,${C.neon},${C.purple}60)`,
                    boxShadow:`0 0 12px ${C.neonGlow}`,
                    transition:"height 0.8s ease" }}/>
                  <span style={{ fontSize:9.5, color:C.muted }}>{d.month}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <p style={{ fontSize:11.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:C.muted, margin:"0 0 16px" }}>Distribuição por Status</p>
            {[
              { label:"Ativo",     count:leads.filter(l=>l.status==="Ativo").length,     color:C.green },
              { label:"Atenção",   count:leads.filter(l=>l.status==="Atenção").length,   color:C.amber },
              { label:"Esfriando", count:leads.filter(l=>l.status==="Esfriando").length, color:C.orange },
              { label:"Em Risco",  count:leads.filter(l=>l.status==="Em Risco").length,  color:C.red },
            ].map(s=>(
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:11.5, color:C.muted, width:70, flexShrink:0 }}>{s.label}</span>
                <div style={{ flex:1, height:6, background:C.subtle, borderRadius:100, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:s.color, borderRadius:100,
                    width:`${leads.length?Math.round(s.count/leads.length*100):0}%`,
                    transition:"width 1s ease", boxShadow:`0 0 8px ${s.color}60` }}/>
                </div>
                <span style={{ fontSize:11, fontFamily:"monospace", color:s.color, width:28, textAlign:"right" }}>{s.count}</span>
              </div>
            ))}
          </GlassCard>

          {/* WhatsApp recovery chart */}
          <GlassCard style={{ gridColumn:"1 / -1" }}>
            <p style={{ fontSize:11.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:C.muted, margin:"0 0 16px" }}>💬 Recuperações via WhatsApp — Últimos 6 Meses</p>
            <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:100 }}>
              {chartData.map((d,i)=>{
                const waMsgs = Math.round(d.conversions * 0.7);
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:10, color:C.green, fontFamily:"monospace", fontWeight:700 }}>{waMsgs}</span>
                    <div style={{ width:"100%", borderRadius:"4px 4px 0 0", height:`${(waMsgs/Math.max(1,...chartData.map(x=>Math.round(x.conversions*0.7))))*80}px`,
                      background:`linear-gradient(180deg,${C.green},${C.cyan}60)`, boxShadow:`0 0 10px ${C.greenGlow}`, transition:"height 0.8s ease" }}/>
                    <span style={{ fontSize:9.5, color:C.muted }}>{d.month}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════ PÓS-VENDA */
function PosVendaScreen({ user, setUser, showToast, onXP, onMenuToggle }) {
  const isDiamante = user.plan === "DIAMANTE";
  const [activeTab, setActiveTab] = useState("ouro");

  /* ── dados das etapas ── */
  const ETAPAS_OURO = [
    {
      id:"pv_checkin",
      emoji:"👋",
      label:"Check-in simples",
      title:"Check-in pós-fechamento",
      desc:"Confirme o recebimento e demonstre atenção logo após a venda.",
      fluxo:"Entre em contato nas primeiras 24h após a venda. Pergunte se tudo chegou bem e se o cliente tem alguma dúvida inicial. Mantenha o tom leve e direto.",
      modelo:(nome,prod)=>`Oi ${nome}! Passando aqui para confirmar que você recebeu ${prod} sem problemas. Qualquer dúvida que surgir, é só chamar! 😊`,
    },
    {
      id:"pv_acomp",
      emoji:"📋",
      label:"Acompanhamento leve",
      title:"Acompanhamento leve",
      desc:"Cheque a satisfação do cliente após alguns dias de uso.",
      fluxo:"Entre em contato 5 a 7 dias após a venda. Pergunte como está a experiência e mostre que você se importa com o resultado. Sem pressão para nova venda.",
      modelo:(nome,prod)=>`${nome}, faz alguns dias que você começou com ${prod}. Como está sendo a experiência? Alguma dúvida que posso esclarecer?`,
    },
    {
      id:"pv_exp",
      emoji:"⭐",
      label:"Experiência",
      title:"Coleta de experiência",
      desc:"Solicite um feedback honesto para fortalecer o relacionamento.",
      fluxo:"Após 2 semanas de uso, peça um feedback rápido. Mostre que a opinião do cliente é importante para o seu apoio contínuo. Não peça avaliação — peça experiência.",
      modelo:(nome,prod)=>`${nome}, quero muito saber como está sendo sua experiência com ${prod}. O que você achou até agora? Seu retorno me ajuda muito a continuar melhorando o apoio!`,
    },
    {
      id:"pv_ajuda",
      emoji:"🤝",
      label:"Ajuda aberta",
      title:"Apoio aberto",
      desc:"Reforce sua disponibilidade e crie um canal de apoio direto.",
      fluxo:"Envie uma mensagem curta reforçando que você está disponível para qualquer dúvida, sem necessidade de motivo especial. Fortaleça a confiança.",
      modelo:(nome,prod)=>`Oi ${nome}! Só passando para reforçar: sempre que precisar de apoio com ${prod}, pode me chamar aqui diretamente. Estou disponível! 🙌`,
    },
    {
      id:"pv_enc",
      emoji:"🎯",
      label:"Encerramento",
      title:"Encerramento do ciclo",
      desc:"Feche o ciclo de pós-venda com reconhecimento e convite suave.",
      fluxo:"Após 30 dias, encerre o ciclo de acompanhamento com uma mensagem positiva. Reconheça a decisão do cliente e deixe um convite aberto para o futuro.",
      modelo:(nome,prod)=>`${nome}, foi um prazer acompanhar sua jornada com ${prod} nesse mês! Qualquer novidade que surgir, você será o primeiro a saber. Obrigado pela confiança! 🙏`,
    },
  ];

  const ETAPAS_DIAMANTE = [
    {
      id:"pvd_checkin",
      emoji:"📊",
      label:"Check-in estruturado",
      title:"Check-in estruturado",
      desc:"Fluxo de acolhimento estruturado com diagnóstico rápido de satisfação.",
      fluxo:"Nas primeiras 24h: confirme entrega, identifique expectativa inicial e mapeie o contexto do cliente para personalizar o acompanhamento. Registre no CRM.",
      modelo:(nome,prod)=>`Oi ${nome}! Aqui é o copiloto de apoio do seu ${prod}. Quero garantir que o início da sua experiência seja impecável. Posso te fazer 2 perguntas rápidas para personalizar seu suporte?`,
    },
    {
      id:"pvd_acomp",
      emoji:"🔄",
      label:"Acompanhamento contínuo",
      title:"Acompanhamento contínuo",
      desc:"Sistema de fluxo contínuo com marcos de 7, 15 e 30 dias.",
      fluxo:"Dia 7: uso inicial. Dia 15: resultados parciais. Dia 30: balanço completo. Em cada contato, registre evolução, ajuste a abordagem e antecipe necessidades do cliente.",
      modelo:(nome,prod)=>`${nome}, chegamos ao marco de 15 dias com ${prod}. Quero entender sua evolução: o que já funcionou bem? O que ainda podemos otimizar juntos?`,
    },
    {
      id:"pvd_eng",
      emoji:"⚡",
      label:"Engajamento",
      title:"Engajamento ativo",
      desc:"Acione gatilhos de engajamento baseados no comportamento do cliente.",
      fluxo:"Monitore sinais de uso e resposta. Se o cliente ficou inativo por mais de 5 dias, ative um gatilho de reengajamento personalizado com conteúdo de valor relacionado ao produto.",
      modelo:(nome,prod)=>`${nome}, trouxe algo que pode acelerar seus resultados com ${prod}. Quando tiver 5 minutos, posso compartilhar uma estratégia que clientes como você têm usado com ótimo retorno.`,
    },
    {
      id:"pvd_rel",
      emoji:"💎",
      label:"Relacionamento ativo",
      title:"Relacionamento ativo",
      desc:"Construa relacionamento estratégico que vai além do produto vendido.",
      fluxo:"Envie conteúdo relevante ao nicho do cliente, reconheça datas importantes e proponha conversas periódicas de valor. O objetivo é ser referência, não apenas fornecedor.",
      modelo:(nome,prod)=>`${nome}, vi algo hoje que me fez pensar em você e em como está usando ${prod}. Posso compartilhar? Acho que vai agregar no seu contexto atual.`,
    },
    {
      id:"pvd_cont",
      emoji:"🚀",
      label:"Continuidade",
      title:"Fluxo de continuidade",
      desc:"Planeje a próxima etapa da jornada do cliente antes do ciclo fechar.",
      fluxo:"No dia 25 do ciclo, inicie a conversa sobre continuidade. Apresente o próximo passo natural da jornada do cliente — sem pressão de venda, com foco em evolução contínua.",
      modelo:(nome,prod)=>`${nome}, seu ciclo com ${prod} está chegando ao fim desta fase. Já pensei no próximo passo que faz sentido para o seu momento. Posso apresentar quando quiser conversar?`,
    },
  ];

  const etapas = isDiamante ? ETAPAS_DIAMANTE : ETAPAS_OURO;
  const [selectedEtapa, setSelectedEtapa] = useState(null);
  const [copied, setCopied] = useState(null);

  const leads = user.leads || [];
  const leadNome = leads[0]?.name?.split(" ")[0] || "Cliente";
  const leadProd = leads[0]?.product || "o produto";

  function copyModelo(etapa) {
    const txt = etapa.modelo(leadNome, leadProd);
    navigator.clipboard.writeText(txt).then(()=>{
      setCopied(etapa.id);
      showToast("Mensagem copiada! 📋","success");
      setTimeout(()=>setCopied(null), 2000);
    });
  }

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle} title="Pós-venda" sub="Fluxo de acompanhamento e relacionamento pós-fechamento"/>

      {/* Tabs Ouro / Diamante */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <button onClick={()=>{ setActiveTab("ouro"); setSelectedEtapa(null); }}
          style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px",
            background:activeTab==="ouro"?`${C.amber}15`:"transparent",
            border:`${activeTab==="ouro"?2:1}px solid ${activeTab==="ouro"?C.amber:C.border}`,
            color:activeTab==="ouro"?C.amber:C.muted,
            borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.15s",
            boxShadow:activeTab==="ouro"?`0 0 14px ${C.amberGlow}`:"none" }}>
          💛 Plano Ouro
        </button>
        <button onClick={()=>{ setActiveTab("diamante"); setSelectedEtapa(null); }}
          style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px",
            background:activeTab==="diamante"?`${C.cyan}15`:"transparent",
            border:`${activeTab==="diamante"?2:1}px solid ${activeTab==="diamante"?C.cyan:C.border}`,
            color:activeTab==="diamante"?C.cyan:C.muted,
            borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.15s",
            boxShadow:activeTab==="diamante"?`0 0 14px ${C.cyanGlow}`:"none" }}>
          💠 Plano Diamante
        </button>
      </div>

      {/* Banner de diferença */}
      <div style={{ marginBottom:20, padding:"14px 18px", borderRadius:12,
        background:activeTab==="ouro"?`${C.amber}08`:`${C.cyan}08`,
        border:`1px solid ${activeTab==="ouro"?C.amber+"30":C.cyan+"30"}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {activeTab==="ouro"
            ? <><span style={{ fontSize:16 }}>💛</span><span style={{ fontSize:12.5, color:C.amber, fontWeight:600 }}>Pós-venda Ouro — apoio simples e direto ao cliente</span></>
            : <><span style={{ fontSize:16 }}>💠</span><span style={{ fontSize:12.5, color:C.cyan, fontWeight:600 }}>Pós-venda Diamante — fluxo estratégico e contínuo</span></>
          }
        </div>
      </div>

      {/* Upgrade banner para Ouro */}
      {activeTab==="diamante" && !isDiamante && (
        <GlassCard glow="purple" style={{ marginBottom:20,
          background:"linear-gradient(135deg,rgba(124,58,237,0.10),rgba(0,212,255,0.05))" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${C.purple}20`,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Gem size={17} color={C.purple}/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.purple }}>Ative o copiloto de vendas em tempo real no Plano Diamante.</div>
                <div style={{ fontSize:11.5, color:C.muted, marginTop:2 }}>Fluxo estratégico, engajamento contínuo e relacionamento ativo liberados.</div>
              </div>
            </div>
            <button onClick={()=>{ setUser(u=>({...u,plan:"DIAMANTE"})); showToast("Plano Diamante ativado! 💠","success"); }}
              style={{ background:`linear-gradient(135deg,${C.purple},${C.cyan})`, color:"#fff",
                border:"none", fontWeight:700, fontSize:12.5, padding:"10px 18px", borderRadius:9, cursor:"pointer",
                boxShadow:`0 4px 16px ${C.purpleGlow}`, flexShrink:0 }}>
              💠 Ativar Diamante
            </button>
          </div>
        </GlassCard>
      )}

      {/* Grid de etapas */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14, marginBottom:20 }}>
        {etapas.map((etapa) => {
          const isActive = selectedEtapa?.id === etapa.id;
          const acColor = activeTab==="ouro" ? C.amber : C.cyan;
          const acGlow  = activeTab==="ouro" ? C.amberGlow : C.cyanGlow;
          return (
            <button key={etapa.id}
              onClick={()=>setSelectedEtapa(isActive ? null : etapa)}
              style={{ textAlign:"left", background:isActive?`${acColor}08`:C.card,
                border:`${isActive?2:1}px solid ${isActive?acColor:C.border}`,
                borderRadius:14, padding:"18px 20px", cursor:"pointer",
                transition:"all 0.2s",
                boxShadow:isActive?`0 6px 24px ${acGlow}`:
                  "inset 0 1px 0 rgba(255,255,255,0.03)" }}
              onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.borderColor=acColor+"50"; e.currentTarget.style.background=`${acColor}05`; }}}
              onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.card; }}}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${acColor}15`,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  boxShadow:`0 0 10px ${acGlow}` }}>
                  <span style={{ fontSize:17 }}>{etapa.emoji}</span>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:acColor, textTransform:"uppercase",
                    letterSpacing:"0.05em" }}>{etapa.label}</div>
                </div>
                <ChevronDown size={14} color={C.muted} style={{ marginLeft:"auto",
                  transform:isActive?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }}/>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:5 }}>{etapa.title}</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.55 }}>{etapa.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Painel de detalhes */}
      {selectedEtapa && (()=>{
        const acColor = activeTab==="ouro" ? C.amber : C.cyan;
        const acGlow  = activeTab==="ouro" ? C.amberGlow : C.cyanGlow;
        return (
          <GlassCard glow={activeTab==="ouro"?"amber":"cyan"} style={{ animation:"fadeInUp 0.3s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:`${acColor}15`,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 0 16px ${acGlow}` }}>
                <span style={{ fontSize:20 }}>{selectedEtapa.emoji}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontWeight:700, color:acColor, textTransform:"uppercase", letterSpacing:"0.06em" }}>{selectedEtapa.label}</div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:800, color:C.text }}>{selectedEtapa.title}</div>
              </div>
              <button onClick={()=>setSelectedEtapa(null)}
                style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", padding:4 }}>
                <X size={16}/>
              </button>
            </div>

            {/* Fluxo */}
            <div style={{ marginBottom:18, padding:"14px 16px",
              background:`${acColor}07`, border:`1px solid ${acColor}25`, borderRadius:10 }}>
              <div style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em",
                color:acColor, marginBottom:7 }}>📌 Fluxo de execução</div>
              <div style={{ fontSize:13, color:C.text, lineHeight:1.65 }}>{selectedEtapa.fluxo}</div>
            </div>

            {/* Modelo de mensagem */}
            <div style={{ marginBottom:0 }}>
              <div style={{ fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em",
                color:C.muted, marginBottom:9 }}>💬 Modelo de mensagem</div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10,
                padding:"14px 16px", fontSize:13.5, color:C.text, lineHeight:1.7, marginBottom:12 }}>
                {selectedEtapa.modelo(leadNome, leadProd)}
              </div>
              <button onClick={()=>copyModelo(selectedEtapa)}
                style={{ display:"flex", alignItems:"center", gap:6, background:`${acColor}15`,
                  border:`1px solid ${acColor}40`, color:acColor,
                  fontWeight:700, fontSize:12.5, padding:"9px 16px", borderRadius:9, cursor:"pointer",
                  boxShadow:`0 0 12px ${acGlow}`,
                  transition:"all 0.15s" }}>
                {copied===selectedEtapa.id
                  ? <><Check size={13}/> Copiado!</>
                  : <><Copy size={13}/> Copiar mensagem</>
                }
              </button>
            </div>
          </GlassCard>
        );
      })()}

      {/* Upgrade interno — visível só no Ouro */}
      {!isDiamante && (
        <div style={{ marginTop:20, padding:"16px 20px", borderRadius:12,
          background:`linear-gradient(135deg, rgba(124,58,237,0.08), rgba(0,212,255,0.05))`,
          border:`1px solid ${C.purple}30`, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <Sparkles size={16} color={C.purple}/>
          <span style={{ fontSize:12.5, color:C.muted, flex:1 }}>
            Evolua seu pós-venda com estratégias mais avançadas no Diamante — fluxo estruturado, engajamento contínuo e relacionamento ativo.
          </span>
          <button onClick={()=>{ setUser(u=>({...u,plan:"DIAMANTE"})); showToast("Plano Diamante ativado! 💠","success"); }}
            style={{ background:`linear-gradient(135deg,${C.purple},${C.neon})`, color:"#fff",
              border:"none", fontWeight:700, fontSize:12, padding:"8px 16px", borderRadius:8, cursor:"pointer",
              boxShadow:`0 4px 14px ${C.purpleGlow}`, flexShrink:0 }}>
            Ver Plano Diamante
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════ CONFIGURAÇÕES */
function ConfigScreen({ user, setUser, showToast, onMenuToggle }) {
  const [name, setName] = useState(user.name);
  const [niche, setNiche] = useState(user.niche);
  const [saved, setSaved] = useState(false);

  function save() {
    setUser(u=>({...u,name:name.trim()||u.name,niche}));
    setSaved(true); showToast("Configurações salvas!","success");
    setTimeout(()=>setSaved(false),2500);
  }

  return (
    <div className="screen-content" style={{ padding:"28px 28px 48px" }}>
      <Topbar user={user} onMenuToggle={onMenuToggle} title="Configurações" sub="Perfil e preferências da conta"/>
      <div style={{ maxWidth:500, display:"flex", flexDirection:"column", gap:14 }}>
        <GlassCard>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:C.muted, margin:"0 0 20px" }}>Perfil</p>
          <label style={{ display:"block", fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.05em", color:C.muted, marginBottom:5, fontWeight:700 }}>Nome</label>
          <input value={name} onChange={e=>setName(e.target.value)}
            style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, color:C.text,
              borderRadius:9, padding:"11px 13px", fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:16,
              fontFamily:"'Inter',sans-serif" }}
            onFocus={e=>e.target.style.borderColor=C.neon} onBlur={e=>e.target.style.borderColor=C.border}/>
          <label style={{ display:"block", fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.05em", color:C.muted, marginBottom:8, fontWeight:700 }}>Nicho</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
            {NICHES.map(n => {
              const Icon = n.icon;
              return (
                <button key={n.id} onClick={()=>setNiche(n.id)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 14px",
                    background:niche===n.id?`${C.neon}12`:C.surface,
                    border:`1px solid ${niche===n.id?C.neon:C.border}`,
                    borderRadius:9, color:niche===n.id?C.neon:C.muted, fontSize:13, fontWeight:600,
                    cursor:"pointer", gridColumn:n.id==="comercio"?"1/-1":"auto", transition:"all 0.15s" }}>
                  <Icon size={15}/>{n.label}
                </button>
              );
            })}
          </div>
          <button onClick={save} disabled={saved}
            style={{ width:"100%", background:saved?C.surface:`linear-gradient(135deg,${C.neon},${C.purple})`,
              color:saved?C.muted:"#fff", border:saved?`1px solid ${C.border}`:"none",
              fontWeight:700, fontSize:14, padding:"12px", borderRadius:10, cursor:saved?"default":"pointer",
              transition:"all 0.2s", boxShadow:saved?"none":`0 6px 20px ${C.neonGlow}` }}>
            {saved ? "✅ Salvo" : "Salvar Configurações"}
          </button>
        </GlassCard>

        {/* Plan selector */}
        <GlassCard>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:C.muted, margin:"0 0 16px" }}>Plano</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { id:"OURO",     emoji:"💛", title:"Plano Ouro",     price:"R$97/mês", features:["CRM Completo","Dashboard Premium","Central de Recuperação","WhatsApp Integration","Exportação CSV","Gamificação"], color:C.amber },
              { id:"DIAMANTE", emoji:"💠", title:"Plano Diamante", price:"R$197/mês", features:["Tudo do Ouro","Closer IA (Groq AI)","Follow-Up IA","Relatórios Avançados","Automações","Suporte Prioritário"], color:C.cyan, badge:"MAIS VENDIDO" },
            ].map(p => {
              const active = user.plan === p.id;
              return (
                <div key={p.id} onClick={()=>{ if(!active){setUser(u=>({...u,plan:p.id})); showToast(`${p.title} ativado! ${p.emoji}`,"success"); }}}
                  style={{ background:active?`${p.color}08`:C.surface, border:`${active?2:1}px solid ${active?p.color:C.border}`,
                    borderRadius:12, padding:"18px 20px", cursor:active?"default":"pointer", transition:"all 0.2s",
                    boxShadow:active?`0 4px 20px ${p.color}20`:"none" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:800, color:p.color }}>{p.emoji} {p.title}</span>
                        {p.badge && <span style={{ fontSize:9.5, fontWeight:700, color:C.cyan, background:`${C.cyan}15`, padding:"2px 7px", borderRadius:100, border:`1px solid ${C.cyan}30` }}>{p.badge}</span>}
                      </div>
                      <div style={{ fontFamily:"monospace", fontSize:14, color:C.muted, marginTop:3 }}>{p.price}</div>
                    </div>
                    {active && <span style={{ fontSize:10, fontWeight:700, color:C.green, background:`${C.green}15`, padding:"3px 10px", borderRadius:100, border:`1px solid ${C.green}30` }}>ATIVO</span>}
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {p.features.map(f=>(
                      <span key={f} style={{ fontSize:11, color:C.muted, display:"flex", alignItems:"center", gap:4 }}>
                        <Check size={10} color={p.color}/> {f}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Stats */}
        <GlassCard>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:C.muted, margin:"0 0 14px" }}>Progresso da Conta</p>
          {[
            { label:"Total de leads",  value:user.leads?.length||0 },
            { label:"XP acumulado",    value:`${user.xp} XP` },
            { label:"Conquistas",      value:`${user.achievements?.length||0}/${ACHIEVEMENTS.length}` },
            { label:"Rank atual",      value:`${getRank(user.xp).current.emoji} ${getRank(user.xp).current.name}` },
          ].map(s=>(
            <div key={s.label} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:12.5, color:C.muted }}>{s.label}</span>
              <span style={{ fontSize:12.5, fontWeight:700, fontFamily:"monospace", color:C.text }}>{s.value}</span>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ LOCKED */
function LockedScreen({ id, setScreen, setUser, showToast }) {
  const names = { closer:"Closer IA", followup:"Follow-Up IA", recovery:"Recovery IA", relatorios:"Relatórios Avançados" };
  const title = names[id] || id;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:500, padding:"48px 32px" }}>
      <div style={{ maxWidth:340, textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:20, background:`${C.amber}12`,
          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px",
          boxShadow:`0 8px 30px ${C.amberGlow}` }}>
          <Lock size={32} color={C.amber}/>
        </div>
        <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", color:C.amber, fontWeight:700, margin:"0 0 10px" }}>Exclusivo Diamante</p>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, margin:"0 0 12px", color:C.text }}>{title}</h2>
        <p style={{ color:C.muted, fontSize:13.5, margin:"0 0 28px", lineHeight:1.7 }}>
          Este módulo está disponível no Plano Diamante. Faça o upgrade e acesse IA avançada, automações e relatórios completos.
        </p>
        <button onClick={()=>{ setUser(u=>({...u,plan:"DIAMANTE"})); setScreen("dashboard"); showToast("Plano Diamante ativado! 💠","success"); }}
          style={{ width:"100%", background:`linear-gradient(135deg,${C.purple},${C.cyan})`, color:"#fff", border:"none",
            fontWeight:700, fontSize:14, padding:"14px", borderRadius:12, cursor:"pointer",
            boxShadow:`0 8px 28px ${C.purpleGlow}`, marginBottom:12 }}>
          💠 Ativar Diamante (Demo)
        </button>
        <button onClick={()=>setScreen("dashboard")}
          style={{ background:"none", border:"none", color:C.muted, fontSize:13, cursor:"pointer", textDecoration:"underline" }}>
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ LOGIN */
function LoginScreen({ onEnter, onBack }) {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("comercio");
  const [plan, setPlan] = useState("DIAMANTE");
  const [mounted, setMounted] = useState(false);
  const nameRef = useRef(null);
  useEffect(()=>{ setTimeout(()=>setMounted(true),80); },[]);

  return (
    <div style={{ width:"100%", minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center",
      padding:"40px 20px", position:"relative", overflow:"hidden",
      background:`radial-gradient(ellipse at 50% -10%, ${C.neonGlow} 0%, transparent 60%), ${C.bg}` }}>
      {/* Ambient background */}
      <div style={{ position:"absolute", top:"20%", left:"10%", width:300, height:300, borderRadius:"50%",
        background:`radial-gradient(circle, ${C.purpleGlow} 0%, transparent 70%)`, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"15%", right:"10%", width:250, height:250, borderRadius:"50%",
        background:`radial-gradient(circle, ${C.cyanGlow} 0%, transparent 70%)`, pointerEvents:"none" }}/>

      <div style={{ width:"100%", maxWidth:380, position:"relative", zIndex:1,
        opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(30px)", transition:"all 0.6s ease" }}>

        {/* Botão voltar ao login */}
        {onBack && (
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <button onClick={onBack}
              style={{ background:"none", border:`1px solid ${C.border}`, color:C.muted,
                fontSize:12, padding:"7px 16px", borderRadius:100, cursor:"pointer",
                fontFamily:"'Inter',sans-serif", display:"inline-flex", alignItems:"center", gap:6 }}>
              ← Voltar para o login
            </button>
          </div>
        )}

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:`linear-gradient(135deg,${C.neon},${C.purple})`,
            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px",
            boxShadow:`0 8px 32px ${C.neonGlow}` }}>
            <Zap size={26} fill="#fff" color="#fff"/>
          </div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:800, letterSpacing:"0.04em",
            margin:"0 0 6px", color:C.text }}>VÁCUO ZERO</h1>
          <p style={{ color:C.muted, fontSize:13.5, margin:"0 0 10px" }}>Sales Intelligence Platform</p>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 14px",
            background:`${C.green}12`, border:`1px solid ${C.green}30`, borderRadius:100 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite",
              boxShadow:`0 0 8px ${C.green}` }}/>
            <span style={{ fontSize:11, color:C.green, fontWeight:600, fontFamily:"monospace" }}>SISTEMA ONLINE</span>
          </div>
        </div>

        {/* Form card */}
        <div style={{ background:`linear-gradient(135deg, ${C.card} 0%, ${C.surface} 100%)`,
          border:`1px solid ${C.border}`, borderRadius:20, padding:"28px 28px 24px",
          boxShadow:`0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)` }}>
          <label style={{ display:"block", fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.06em",
            color:C.muted, margin:"0 0 6px", fontWeight:700 }}>Seu nome</label>
          <input ref={nameRef} defaultValue={name} onChange={e=>setName(e.target.value)} placeholder="Como podemos te chamar"
            style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, color:C.text,
              borderRadius:10, padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box",
              fontFamily:"'Inter',sans-serif", transition:"border-color 0.2s" }}
            onFocus={e=>e.target.style.borderColor=C.neon} onBlur={e=>e.target.style.borderColor=C.border}/>

          <label style={{ display:"block", fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.06em",
            color:C.muted, margin:"16px 0 8px", fontWeight:700 }}>Nicho</label>
          <div className="login-niche-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {NICHES.map(n => {
              const Icon = n.icon;
              return (
                <button key={n.id} onClick={()=>setNiche(n.id)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px",
                    background:niche===n.id?`${C.neon}12`:C.surface,
                    border:`1px solid ${niche===n.id?C.neon:C.border}`,
                    borderRadius:9, color:niche===n.id?C.neon:C.muted, fontSize:12.5, fontWeight:600,
                    cursor:"pointer",
                    transition:"all 0.15s", boxShadow:niche===n.id?`0 0 12px ${C.neonGlow}`:"none" }}>
                  <Icon size={14}/>{n.label}
                </button>
              );
            })}
          </div>

          <label style={{ display:"block", fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.06em",
            color:C.muted, margin:"16px 0 8px", fontWeight:700 }}>Plano</label>
          <div className="login-plan-row" style={{ display:"flex", gap:8 }}>
            {[
              { id:"OURO",     emoji:"💛", label:"Ouro",     price:"R$97/mês",  desc:"CRM + Recovery" },
              { id:"DIAMANTE", emoji:"💠", label:"Diamante", price:"R$197/mês", desc:"Tudo + Closer IA", best:true },
            ].map(p => (
              <button key={p.id} onClick={()=>setPlan(p.id)}
                style={{ flex:1, padding:"12px 10px", position:"relative",
                  background:plan===p.id?`${p.id==="DIAMANTE"?C.cyan:C.amber}10`:C.surface,
                  border:`${plan===p.id?2:1}px solid ${plan===p.id?(p.id==="DIAMANTE"?C.cyan:C.amber):C.border}`,
                  borderRadius:10, cursor:"pointer", transition:"all 0.15s",
                  boxShadow:plan===p.id?`0 0 16px ${p.id==="DIAMANTE"?C.cyanGlow:C.amberGlow}`:"none" }}>
                {p.best && <div style={{ position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)",
                  background:C.cyan, color:C.bg, fontSize:8, fontWeight:800, padding:"2px 8px", borderRadius:100, whiteSpace:"nowrap" }}>MAIS VENDIDO</div>}
                <div style={{ fontSize:18, marginBottom:4 }}>{p.emoji}</div>
                <div style={{ fontSize:13, fontWeight:700, color:plan===p.id?(p.id==="DIAMANTE"?C.cyan:C.amber):C.muted }}>{p.label}</div>
                <div style={{ fontSize:10.5, color:C.muted, fontFamily:"monospace" }}>{p.price}</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>{p.desc}</div>
              </button>
            ))}
          </div>

          <button disabled={!name.trim()} onClick={()=>onEnter({name:name.trim(),niche,plan})}
            style={{ marginTop:20, width:"100%",
              background:name.trim()?`linear-gradient(135deg,${C.neon},${C.purple})`:`${C.subtle}40`,
              color:name.trim()?"#fff":C.muted, border:"none", fontWeight:700, fontSize:14.5,
              padding:"14px 18px", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center",
              gap:9, cursor:name.trim()?"pointer":"not-allowed", transition:"all 0.2s",
              boxShadow:name.trim()?`0 8px 28px ${C.neonGlow}`:"none" }}>
            Entrar no Vácuo Zero <ChevronRight size={17}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ ONBOARDING */
const ONBOARDING_STEPS = [
  { icon:"🚀", title:"Bem-vindo ao Vácuo Zero Premium", desc:"Sua plataforma completa de Sales Intelligence. Monitore leads, recupere clientes e feche mais com IA." },
  { icon:"🔴", title:"Central de Recuperação", desc:"Leads que não responderam são identificados automaticamente. A IA gera mensagens e estratégias personalizadas." },
  { icon:"💠", title:"Closer IA",  desc:"Cole a mensagem do lead e receba a resposta ideal para fechar. Especializado no seu nicho." },
  { icon:"🏆", title:"Ganhe XP e Suba de Rank", desc:"Cada ação gera XP. Suba de Iniciante até Diamante e apareça no Ranking Global." },
];

function OnboardingModal({ onClose, setScreen }) {
  const [step, setStep] = useState(0);
  const s = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex",
      alignItems:"center", justifyContent:"center", zIndex:10002, padding:20, backdropFilter:"blur(10px)" }}>
      <div style={{ background:C.card, border:`1px solid ${C.borderHi}`, borderRadius:24,
        padding:"40px 36px 32px", maxWidth:380, width:"100%", textAlign:"center",
        animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow:`0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(79,110,247,0.1)` }}>
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:32 }}>
          {ONBOARDING_STEPS.map((_,i)=>(
            <div key={i} style={{ height:4, borderRadius:100, transition:"all 0.3s",
              width:i===step?28:8,
              background:i===step?C.neon:i<step?C.green:C.subtle }}/>
          ))}
        </div>
        <div style={{ fontSize:60, marginBottom:20, filter:`drop-shadow(0 0 20px ${C.neonGlow})` }}>{s.icon}</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, margin:"0 0 12px", color:C.text }}>{s.title}</h2>
        <p style={{ color:C.muted, fontSize:13.5, lineHeight:1.7, margin:"0 0 30px" }}>{s.desc}</p>
        <button onClick={()=>{ if(isLast){onClose();}else setStep(p=>p+1); }}
          style={{ width:"100%", background:`linear-gradient(135deg,${C.neon},${C.purple})`, color:"#fff", border:"none",
            fontWeight:700, fontSize:14, padding:"14px", borderRadius:11, cursor:"pointer",
            boxShadow:`0 8px 24px ${C.neonGlow}`, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {isLast ? "Começar agora 🚀" : <>Próximo <ChevronRight size={16}/></>}
        </button>
        {!isLast && (
          <button onClick={onClose}
            style={{ marginTop:12, background:"none", border:"none", color:C.muted, fontSize:12.5, cursor:"pointer" }}>
            Pular tour
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ APP */
export default function App() {
  // ── Supabase auth state ────────────────────────────────────────────────
  const [authUser, setAuthUser]   = useState(null);   // Supabase user
  const [authLoading, setAuthLoading] = useState(true); // aguarda sessão inicial

  // ── App state (dados do perfil do usuário no sistema) ──────────────────
  const [user, setUserRaw]        = useState(null);   // perfil Vácuo Zero
  const [screen, setScreen]       = useState("dashboard");
  const [toast, setToast]         = useState(null);
  const [xpPop, setXpPop]         = useState(null);
  const [rankUp, setRankUp]       = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const prevRankRef = useRef(null);

  // setUser persiste automaticamente com o UID da sessão
  function setUser(updater) {
    setUserRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (next && authUser) saveUser(next, authUser.id);
      return next;
    });
  }

  // ── Verifica se o e-mail logado realmente tem acesso pago ──────────────
  // (segunda checagem, independente da que já acontece na tela de login,
  // pra cobrir casos de sessão restaurada ou conta criada por fora do app)
  async function temAcessoPago(email) {
    if (!email) return false;
    const { data, error } = await supabase.rpc('verificar_acesso', { p_email: email });
    if (error) return false;
    return Array.isArray(data) && data.length > 0;
  }

  // ── Carrega sessão Supabase ao montar ──────────────────────────────────
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const liberado = await temAcessoPago(session.user.email);
        if (!liberado) {
          await supabase.auth.signOut();
          if (mounted) { setAuthUser(null); setUserRaw(null); setAuthLoading(false); }
          return;
        }
        setAuthUser(session.user);
        const saved = loadUser(session.user.id);
        setUserRaw(saved); // null se primeiro acesso
      }
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const liberado = await temAcessoPago(session.user.email);
        if (!liberado) {
          await supabase.auth.signOut();
          if (mounted) { setAuthUser(null); setUserRaw(null); setScreen("dashboard"); }
          return;
        }
        setAuthUser(session.user);
        setUserRaw(prev => prev || loadUser(session.user.id));
      } else {
        setAuthUser(null);
        setUserRaw(null);
        setScreen("dashboard");
      }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // ── Persiste dados quando user muda (com UID) ──────────────────────────
  useEffect(() => {
    if (user && authUser) saveUser(user, authUser.id);
  }, [user, authUser]);

  // ── Rank up detector ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const { current } = getRank(user.xp);
    if (prevRankRef.current && prevRankRef.current !== current.name) setRankUp(current);
    prevRankRef.current = current.name;
  }, [user?.xp]);

  // ── Onboarding por usuário ─────────────────────────────────────────────
  useEffect(() => {
    if (!authUser) return;
    try {
      if (!localStorage.getItem(onbKey(authUser.id))) setShowOnboarding(true);
    } catch { setShowOnboarding(true); }
  }, [authUser]);

  useEffect(()=>{
    if(sidebarOpen){document.body.style.overflow="hidden";}
    else{document.body.style.overflow="";}
    return()=>{document.body.style.overflow="";};
  },[sidebarOpen]);

  function showToast(msg, type="info") { setToast({msg,type}); }
  function onXP(amount) { setXpPop(amount); setTimeout(()=>setXpPop(null),1900); }

  function navigate(target) {
    if (!user) return;
    const diamanteOnly = ["closer","relatorios"];
    if (diamanteOnly.includes(target) && user.plan !== "DIAMANTE") { setScreen("locked:"+target); setSidebarOpen(false); window.scrollTo&&window.scrollTo(0,0); return; }
    setScreen(target);
    setSidebarOpen(false);
    window.scrollTo&&window.scrollTo(0,0);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserRaw(null);
    setAuthUser(null);
    setScreen("dashboard");
    setSidebarOpen(false);
  }

  const cp = { user, setUser, setScreen:navigate, showToast, onXP, onMenuToggle:()=>setSidebarOpen(o=>!o) };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:C.bg, color:C.text,
      minHeight:"100dvh", width:"100%", display:"flex", borderRadius:0, overflow:"hidden",
      border:`1px solid ${C.border}` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes spin       { to{transform:rotate(360deg);} }
        @keyframes pulse      { 0%,100%{opacity:1;box-shadow:0 0 8px currentColor}50%{opacity:.4;box-shadow:none} }
        @keyframes toastSlide { from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes xpFly      { 0%{opacity:0;transform:translateY(0)}10%{opacity:1}80%{opacity:1;transform:translateY(-30px)}100%{opacity:0;transform:translateY(-50px)} }
        @keyframes popIn      { from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)} }
        @keyframes shimmer    { 0%{background-position:200% 0}100%{background-position:-200% 0} }
        @keyframes bounce     { 0%,80%,100%{transform:scale(0)}40%{transform:scale(1)} }
        @keyframes fadeInUp   { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)} }

        *{box-sizing:border-box;}
        h1,h2,h3{font-family:'Space Grotesk',sans-serif;}
        button{cursor:pointer;font-family:'Inter',sans-serif;}
        input,textarea{font-family:'Inter',sans-serif;}

        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:${C.subtle};border-radius:10px}

        /* ── Layout base (desktop) ── */
        .sidebar-panel{position:relative;transform:none !important;z-index:auto;}
        .sidebar-backdrop{display:none !important;}
        .sidebar-close-btn{display:none !important;}
        .hamburger-btn{display:none !important;}
        .app-layout{display:flex;width:100%;min-height:100dvh;}
        .app-main{flex:1;min-width:0;height:100dvh;overflow-y:auto;overflow-x:hidden;}

        /* ── Modais: garantir z-index acima de tudo ── */
        [style*="position:fixed"][style*="zIndex:9999"],
        [style*="position:fixed"][style*="zIndex:10005"],
        [style*="position:fixed"][style*="zIndex:10006"] {
          z-index:10010 !important;
        }

        /* ── Tablet (769–1024px) ── */
        @media (max-width:1024px) and (min-width:769px){
          .metrics-grid{grid-template-columns:repeat(2,1fr) !important;}
          .metrics-grid-3{grid-template-columns:repeat(2,1fr) !important;}
          .dashboard-two-col{grid-template-columns:1fr !important;}
          .reports-charts{grid-template-columns:1fr !important;}
          .leads-table-header,.leads-table-row{grid-template-columns:2fr 1.2fr 1fr 0.7fr 1fr 1fr !important;}
          .lead-col-vacuum{display:none !important;}
          .screen-content{padding:22px 20px 48px !important;}
          .ia-split-layout{grid-template-columns:180px 1fr !important;}
          .gamif-grid{grid-template-columns:1fr !important;}
        }

        /* ── Mobile (≤768px) ── */
        @media (max-width:768px){
          .sidebar-backdrop{display:block !important;}
          .hamburger-btn{display:flex !important;}
          .sidebar-close-btn{display:flex !important;}
          .sidebar-panel{
            position:fixed !important;
            top:0 !important;left:0 !important;bottom:0 !important;
            width:88% !important;max-width:300px !important;
            height:100dvh !important;
            z-index:9999 !important;
            transform:${sidebarOpen?"translateX(0)":"translateX(-100%)"} !important;
            transition:transform 0.28s cubic-bezier(0.4,0,0.2,1) !important;
            overflow-y:hidden !important;
            display:flex !important;
          }
          .app-layout{display:block;min-height:100%;}
          .app-main{max-height:none;min-height:100%;overflow-y:auto;overflow-x:hidden;}

          /* Screen padding */
          .screen-content{padding:14px 12px 80px !important;}

          /* Topbar */
          .topbar-sub{display:none !important;}
          .topbar-title{font-size:17px !important;}

          /* Metrics: 2 cols on mobile */
          .metrics-grid{grid-template-columns:repeat(2,1fr) !important;gap:8px !important;}
          .metrics-grid-3{grid-template-columns:repeat(2,1fr) !important;gap:8px !important;}
          .metrics-grid-3 > div:last-child{grid-column:1/-1 !important;}

          /* Dashboard two-col → single col */
          .dashboard-two-col{grid-template-columns:1fr !important;gap:12px !important;}

          /* CRM table: simplified */
          .leads-table-header,.leads-table-row{
            grid-template-columns:2fr 0.7fr 1.1fr !important;
            padding:10px 12px !important;
          }
          .lead-col-phone,.lead-col-product,.lead-col-vacuum{display:none !important;}

          /* Dashboard rank row */
          .rank-gauge-row{flex-direction:column !important;align-items:flex-start !important;}
          .rank-gauge-row .vacuum-gauge{display:none !important;}

          /* Closer IA: stack layout */
          .ia-split-layout{grid-template-columns:1fr !important;height:auto !important;gap:10px !important;}
          .ia-split-layout > div:first-child{
            display:grid !important;grid-template-columns:1fr 1fr !important;
            max-height:160px !important;overflow-y:auto !important;gap:6px !important;
          }
          .ia-split-layout > div:last-child{height:420px !important;}

          /* Closer IA counter: compact */
          .ia-counter-row{flex-wrap:wrap !important;gap:5px !important;}
          .ia-counter-label{display:none !important;}

          /* Reports charts */
          .reports-charts{grid-template-columns:1fr !important;}

          /* Gamificação grid */
          .gamif-grid{grid-template-columns:1fr !important;}

          /* Modals: full width */
          [style*="maxWidth:520px"],[style*="maxWidth:440px"],[style*="maxWidth:380px"]{
            max-width:calc(100vw - 24px) !important;
            margin:0 auto !important;
            border-radius:18px !important;
          }

          /* WhatsApp type buttons */
          .wa-type-row{flex-wrap:wrap !important;gap:5px !important;}

          /* Recovery card actions: stack */
          .recovery-actions{flex-direction:column !important;gap:6px !important;}
          .recovery-actions button{width:100% !important;justify-content:center !important;}

          /* Login: nicho grid */
          .login-niche-grid{grid-template-columns:1fr !important;}
          .login-niche-grid button{grid-column:auto !important;}
          .login-plan-row{flex-direction:column !important;}

          /* Config plan selector */
          .plan-selector{flex-direction:column !important;}

          /* Quick tools grid */
          .quick-tools-grid{grid-template-columns:1fr !important;}
        }

        /* ── Extra small (≤400px) ── */
        @media (max-width:400px){
          .metrics-grid{grid-template-columns:1fr !important;}
          .metrics-grid-3{grid-template-columns:1fr !important;}
          .metrics-grid-3 > div:last-child{grid-column:auto !important;}
          .screen-content{padding:12px 10px 76px !important;}
          .ia-split-layout > div:first-child{grid-template-columns:1fr !important;}
        }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {xpPop && <XPPop amount={xpPop} onDone={()=>setXpPop(null)}/>}
      {rankUp && <RankUpModal rank={rankUp} onClose={()=>setRankUp(null)}/>}
      {showOnboarding && user && authUser && (
        <OnboardingModal
          onClose={()=>{
            setShowOnboarding(false);
            try { localStorage.setItem(onbKey(authUser.id), "1"); } catch {}
          }}
          setScreen={navigate}/>
      )}

      {/* ── Carregando sessão ── */}
      {authLoading ? (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
          width:"100%", minHeight:"100dvh", background:C.bg }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
            <div style={{ width:44, height:44, borderRadius:13,
              background:`linear-gradient(135deg,${C.neon},${C.purple})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 6px 20px ${C.neonGlow}` }}>
              <Zap size={20} fill="#fff" color="#fff"/>
            </div>
            <div style={{ width:22, height:22, border:`2px solid ${C.neon}`,
              borderTopColor:"transparent", borderRadius:"50%",
              animation:"spin 0.7s linear infinite" }}/>
          </div>
        </div>

      /* ── Sem sessão Supabase → tela de Auth ── */
      ) : !authUser ? (
        <AuthScreen onAuthenticated={supabaseUser => {
          setAuthUser(supabaseUser);
          const saved = loadUser(supabaseUser.id);
          if (saved) {
            // Usuário já tem perfil → entra direto (garante uid atualizado)
            setUserRaw({...saved, uid: supabaseUser.id});
            prevRankRef.current = getRank(saved.xp).current.name;
          }
          // Se não tem perfil salvo → user continua null → cai no LoginScreen (onboarding de perfil)
        }}/>

      /* ── Tem sessão mas ainda não configurou perfil → LoginScreen (onboarding de nicho/plano) ── */
      ) : !user ? (
        <LoginScreen onEnter={u=>{
          // Novo usuário: começa limpo, sem demo data
          const newUser = {
            ...u,
            uid: authUser.id,
            leads: [],
            achievements: [],
            xp: 0,
          };
          setUserRaw(newUser);
          saveUser(newUser, authUser.id);
          prevRankRef.current = getRank(0).current.name;
          setShowOnboarding(true);
        }} onBack={async ()=>{
          await supabase.auth.signOut();
          setAuthUser(null);
          setUserRaw(null);
        }}/>

      /* ── Sessão + perfil → app normal ── */
      ) : (
        <div className="app-layout">
          <Sidebar
            screen={screen.startsWith("locked:")?screen.slice(7):screen}
            setScreen={navigate}
            user={user}
            onLogout={handleLogout}
            isOpen={sidebarOpen}
            onClose={()=>setSidebarOpen(false)}
          />
          <main className="app-main">
            {screen==="dashboard"    && <DashboardScreen    {...cp}/>}
            {screen==="crm"          && <CRMScreen          {...cp}/>}
            {screen==="recuperacao"  && <RecuperacaoScreen  {...cp}/>}
            {screen==="estrategia"   && <EstrategiaScreen   {...cp}/>}
            {screen==="closer"       && <CloserScreen       {...cp}/>}
            {screen==="posVenda"     && <PosVendaScreen     {...cp}/>}
            {screen==="gamificacao"  && <GamificacaoScreen  {...cp}/>}
            {screen==="treinamentos" && <TreinamentosScreen {...cp}/>}
            {screen==="relatorios"   && <RelatoriosScreen   {...cp}/>}
            {screen==="config"       && <ConfigScreen       {...cp}/>}
            {screen.startsWith("locked:") && (
              <LockedScreen id={screen.slice(7)} setScreen={navigate} setUser={setUser} showToast={showToast}/>
            )}
          </main>
        </div>
      )}
    </div>
  );
   }

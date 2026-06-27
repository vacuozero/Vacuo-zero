// api/webhook-kiwify.js
// Coloque este arquivo na pasta /api na raiz do projeto
// Vercel detecta automaticamente e transforma em rota de API

import { createClient } from '@supabase/supabase-js';

// ── Variáveis de ambiente (configure na Vercel) ──────────────────────────
// SUPABASE_URL        → URL do seu projeto Supabase (Settings → API)
// SUPABASE_SERVICE_KEY → Service Role Key do Supabase (NÃO a anon key)
// KIWIFY_SECRET_TOKEN → Token secreto que você define na Kiwify

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // Service key tem permissão para criar usuários
);

export default async function handler(req, res) {

  // ── 1. Aceitar apenas POST ──────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // ── 2. Validar token de segurança da Kiwify ─────────────────────────────
  const tokenRecebido = req.query.token || req.headers['x-kiwify-token'];
  const tokenEsperado = process.env.KIWIFY_SECRET_TOKEN;

  if (!tokenRecebido || tokenRecebido !== tokenEsperado) {
    console.error('Token inválido:', tokenRecebido);
    return res.status(401).json({ error: 'Token inválido' });
  }

  // ── 3. Extrair dados do JSON da Kiwify ──────────────────────────────────
  const body = req.body;

  const status     = body?.order?.status;                    // "paid" = aprovado
  const email      = body?.Customer?.email;
  const nome       = body?.Customer?.full_name || 'Usuário';
  const produto    = body?.Product?.name || '';
  const orderId    = body?.order?.id || '';

  console.log(`Webhook recebido | Status: ${status} | Email: ${email} | Produto: ${produto}`);

  // ── 4. Processar apenas pagamentos aprovados ────────────────────────────
  if (status !== 'paid') {
    console.log('Pagamento não aprovado, ignorando. Status:', status);
    return res.status(200).json({ message: 'Ignorado — status não é paid' });
  }

  if (!email) {
    console.error('Email não encontrado no webhook');
    return res.status(400).json({ error: 'Email não encontrado' });
  }

  // ── 5. Verificar se usuário já existe ───────────────────────────────────
  const { data: usuariosExistentes } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (usuariosExistentes) {
    console.log('Usuário já existe:', email);
    return res.status(200).json({ message: 'Usuário já existe', email });
  }

  // ── 6. Criar usuário no Supabase ────────────────────────────────────────
  // Gera uma senha temporária segura — o usuário vai redefinir pelo email
  const senhaTemporaria = `VZ_${Math.random().toString(36).slice(2, 10).toUpperCase()}!`;

  const { data: novoUsuario, error: erroCreate } = await supabase.auth.admin.createUser({
    email:          email,
    password:       senhaTemporaria,
    email_confirm:  true,           // Confirma o email automaticamente
    user_metadata: {
      full_name:  nome,
      produto:    produto,
      order_id:   orderId,
      plano:      produto.toLowerCase().includes('diamante') ? 'DIAMANTE' : 'OURO',
    }
  });

  if (erroCreate) {
    console.error('Erro ao criar usuário:', erroCreate.message);
    return res.status(500).json({ error: erroCreate.message });
  }

  console.log('✅ Usuário criado com sucesso:', email);

  // ── 7. Enviar email de boas-vindas com a senha ──────────────────────────
  // O Supabase envia automaticamente um email de confirmação.
  // Opcionalmente você pode enviar um email customizado aqui com a senha temporária.
  // Recomendado: usar o reset de senha para o usuário criar a própria senha.

  await supabase.auth.admin.generateLink({
    type:  'recovery',
    email: email,
  });

  // ── 8. Retornar sucesso ─────────────────────────────────────────────────
  return res.status(200).json({
    message: 'Usuário criado com sucesso',
    email:   email,
    plano:   novoUsuario.user?.user_metadata?.plano,
  });
}

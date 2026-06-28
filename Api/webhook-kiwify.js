
// api/webhook-kiwify.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {

  // ── 1. Apenas POST ──────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // ── 2. Validar token ────────────────────────────────────────────────────
  const tokenRecebido = req.query.token || req.headers['x-kiwify-token'];
  if (!tokenRecebido || tokenRecebido !== process.env.KIWIFY_SECRET_TOKEN) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  // ── 3. Extrair dados da Kiwify ──────────────────────────────────────────
  const body    = req.body;
  const status  = body?.order?.status;
  const email   = body?.Customer?.email;
  const nome    = body?.Customer?.full_name || 'Usuário';
  const produto = body?.Product?.name || '';
  const plano   = produto.toLowerCase().includes('diamante') ? 'DIAMANTE' : 'OURO';

  console.log(`Webhook | Status: ${status} | Email: ${email} | Plano: ${plano}`);

  // ── 4. Apenas pagamentos aprovados ──────────────────────────────────────
  if (status !== 'paid') {
    return res.status(200).json({ message: 'Ignorado — status não é paid' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email não encontrado' });
  }

  // ── 5. Registrar na tabela clientes_pagos ───────────────────────────────
  const { error: errTabela } = await supabase
    .from('clientes_pagos')
    .upsert({ email, plano }, { onConflict: 'email' });

  if (errTabela) {
    console.error('Erro ao registrar cliente:', errTabela.message);
  } else {
    console.log('✅ Cliente registrado na tabela:', email);
  }

  // ── 6. Criar usuário no Supabase Auth ───────────────────────────────────
  const { data: usuarioExistente } = await supabase.auth.admin.listUsers();
  const jaExiste = usuarioExistente?.users?.find(u => u.email === email);

  if (!jaExiste) {
    const senha = `VZ_${Math.random().toString(36).slice(2,10).toUpperCase()}!`;
    const { error: errCreate } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { full_name: nome, plano }
    });

    if (errCreate) {
      console.error('Erro ao criar usuário:', errCreate.message);
    } else {
      console.log('✅ Usuário criado:', email);
      // Envia link de redefinição de senha para o cliente criar sua própria senha
      await supabase.auth.admin.generateLink({ type: 'recovery', email });
    }
  } else {
    // Atualiza o plano do usuário existente
    await supabase.auth.admin.updateUserById(jaExiste.id, {
      user_metadata: { plano }
    });
    console.log('✅ Plano atualizado para usuário existente:', email);
  }

  return res.status(200).json({ message: 'Sucesso', email, plano });
}

// supabase/functions/kiwify-webhook/index.ts
// Edge Function que recebe eventos da Kiwify e gerencia acesso no Supabase Auth

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

serve(async (req) => {
  // Apenas POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const body = await req.json()

    // Eventos que a Kiwify envia
    const evento = body?.webhook_event_type || body?.status
    const email  = body?.Customer?.email || body?.customer?.email

    if (!email) {
      return new Response('E-mail não encontrado no payload', { status: 400 })
    }

    console.log(`Evento: ${evento} | E-mail: ${email}`)

    // ── Compra aprovada ou assinatura ativa ──────────────────────────────
    if (
      evento === 'order_approved'      ||
      evento === 'subscription_active' ||
      evento === 'paid'
    ) {
      // Verifica se usuário já existe
      const { data: existing } = await supabaseAdmin.auth.admin.listUsers()
      const userExists = existing?.users?.find(u => u.email === email)

      if (userExists) {
        // Reativa o usuário se estava bloqueado
        await supabaseAdmin.auth.admin.updateUserById(userExists.id, {
          ban_duration: 'none',
        })
        console.log(`Usuário reativado: ${email}`)
      } else {
        // Cria novo usuário e envia convite por e-mail
        const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: 'https://alanrocha07.github.io/eletricacalc',
        })
        if (error) {
          console.error('Erro ao criar usuário:', error.message)
          return new Response(`Erro: ${error.message}`, { status: 500 })
        }
        console.log(`Usuário criado e convite enviado: ${email}`)
      }
    }

    // ── Reembolso, cancelamento ou chargeback ────────────────────────────
    if (
      evento === 'order_refunded'         ||
      evento === 'subscription_canceled'  ||
      evento === 'subscription_overdue'   ||
      evento === 'refunded'               ||
      evento === 'chargedback'
    ) {
      const { data: existing } = await supabaseAdmin.auth.admin.listUsers()
      const user = existing?.users?.find(u => u.email === email)

      if (user) {
        // Bloqueia o usuário por 10 anos (acesso revogado)
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          ban_duration: '87600h',
        })
        console.log(`Usuário bloqueado: ${email}`)
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Erro no webhook:', err)
    return new Response('Erro interno', { status: 500 })
  }
})

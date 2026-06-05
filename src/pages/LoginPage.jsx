import { useState } from 'react'
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [info,      setInfo]      = useState('')
  const [mode,      setMode]      = useState('login') // 'login' | 'forgot'

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(traduzirErro(error.message))
    setLoading(false)
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://alanrocha07.github.io/eletricacalc',
    })
    if (error) setError(traduzirErro(error.message))
    else setInfo('E-mail de redefinição enviado. Verifique sua caixa de entrada.')
    setLoading(false)
  }

  function traduzirErro(msg) {
    if (msg.includes('Invalid login'))     return 'E-mail ou senha incorretos.'
    if (msg.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar.'
    if (msg.includes('User not found'))    return 'Usuário não encontrado.'
    if (msg.includes('rate limit'))        return 'Muitas tentativas. Aguarde alguns minutos.'
    return 'Erro ao entrar. Tente novamente.'
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">ElétriCalc</h1>
            <p className="text-xs text-muted-foreground mt-1">NBR 5410 · NBR 5444 · NBR 14136</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            {mode === 'login' ? 'Entrar na sua conta' : 'Redefinir senha'}
          </h2>

          <form onSubmit={mode === 'login' ? handleLogin : handleForgot} className="space-y-4">

            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full bg-input border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            {/* Senha — só no login */}
            {mode === 'login' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-input border border-border rounded-md pl-9 pr-10 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Info */}
            {info && (
              <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-xs text-success">
                {info}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {loading
                ? 'Aguarde...'
                : mode === 'login' ? 'Entrar' : 'Enviar e-mail de redefinição'
              }
            </button>
          </form>

          {/* Links */}
          <div className="flex flex-col items-center gap-2 pt-1">
            {mode === 'login' ? (
              <button
                onClick={() => { setMode('forgot'); setError(''); setInfo(''); }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Esqueci minha senha
              </button>
            ) : (
              <button
                onClick={() => { setMode('login'); setError(''); setInfo(''); }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                ← Voltar para o login
              </button>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <p className="text-center text-xs text-muted-foreground">
          Acesso exclusivo para assinantes. Para adquirir acesso, entre em contato.
        </p>
      </div>
    </div>
  )
}

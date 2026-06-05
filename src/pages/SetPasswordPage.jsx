import { useState, useEffect } from 'react'
import { Zap, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SetPasswordPage() {
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  // Força o Supabase a processar o token da URL ao carregar a página
  useEffect(() => {
    supabase.auth.getSession()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Erro ao definir senha. O link pode ter expirado — solicite um novo acesso.')
    } else {
      setSuccess(true)
    }
    setLoading(false)
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

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">

          {success ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle className="h-12 w-12 text-success" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">Senha definida com sucesso!</h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Você já pode usar o ElétriCalc. Faça login com seu e-mail e nova senha.
                </p>
              </div>
              <a
                href="/eletricacalc"
                className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm text-center block hover:bg-primary/90 transition-colors"
              >
                Ir para o login
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Defina sua senha
              </h2>
              <p className="text-xs text-muted-foreground">
                Crie uma senha segura para acessar o ElétriCalc.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nova senha */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Nova senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Mínimo 8 caracteres"
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

                {/* Confirmar senha */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      required
                      placeholder="Repita a senha"
                      className="w-full bg-input border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Erro */}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Definir senha e entrar'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

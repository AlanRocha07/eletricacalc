import { useEffect, useState } from 'react'
import { supabase }        from './lib/supabase'
import Home                from './pages/Home'
import LoginPage           from './pages/LoginPage'
import SetPasswordPage     from './pages/SetPasswordPage'

export default function App() {
  const [user,        setUser]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [isSetPass,   setIsSetPass]   = useState(false)

  useEffect(() => {
    // Detecta se a URL contém token de convite ou reset de senha
    const hash   = window.location.hash
    const params = new URLSearchParams(hash.replace('#', '?'))
    const type   = params.get('type')

    if (type === 'invite' || type === 'recovery') {
      setIsSetPass(true)
      setLoading(false)
      return
    }

    // Verifica sessão atual
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Escuta mudanças de sessão
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      // Após definir a senha, redireciona para o app
      if (_event === 'USER_UPDATED' || _event === 'SIGNED_IN') {
        setIsSetPass(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Carregando...</div>
      </div>
    )
  }

  if (isSetPass) return <SetPasswordPage />
  return user ? <Home user={user} /> : <LoginPage />
}

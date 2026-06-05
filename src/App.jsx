import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Home      from './pages/Home'
import LoginPage from './pages/LoginPage'

export default function App() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica sessão atual
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Escuta mudanças de sessão (login, logout, expiração)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Tela de carregamento inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Carregando...</div>
      </div>
    )
  }

  // Roteamento simples: logado → app / não logado → login
  return user ? <Home user={user} /> : <LoginPage />
}

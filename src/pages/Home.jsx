import { useState } from 'react';
import { Zap, PlugZap, BookOpen, LogOut } from 'lucide-react';
import CircuitCalculator from '../components/CircuitCalculator';
import RoomPoints        from '../components/RoomPoints';
import QuickReference    from '../components/QuickReference';
import { supabase }      from '../lib/supabase';

const TABS = [
  { id: 'circuit',   label: 'Dimensionar Circuito', icon: Zap      },
  { id: 'room',      label: 'Pontos por Ambiente',  icon: PlugZap  },
  { id: 'reference', label: 'Referência Rápida',    icon: BookOpen },
];

export default function Home({ user }) {
  const [tab, setTab] = useState('circuit');

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Cabeçalho fixo ── */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">ElétriCalc</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                NBR 5410 · NBR 5444 · NBR 14136
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[160px]">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              title="Sair"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>

        {/* Abas de navegação */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 pb-0 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Conteúdo principal ── */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'circuit'   && <CircuitCalculator />}
        {tab === 'room'      && <RoomPoints />}
        {tab === 'reference' && <QuickReference />}
      </main>

      {/* ── Rodapé ── */}
      <footer className="border-t border-border mt-12 py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            ElétriCalc — Calculadora para eletricistas e técnicos
          </p>
          <p className="text-xs text-muted-foreground">
            Baseado em NBR 5410 · NBR 5444 · NBR 14136 — Maio 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

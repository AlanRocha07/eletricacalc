import { useState } from 'react';
import { Zap, PlugZap, BookOpen } from 'lucide-react';
import CircuitCalculator from '../components/CircuitCalculator';
import RoomPoints        from '../components/RoomPoints';
import QuickReference    from '../components/QuickReference';

const TABS = [
  { id: 'circuit',   label: 'Dimensionar Circuito', icon: Zap      },
  { id: 'room',      label: 'Pontos por Ambiente',  icon: PlugZap  },
  { id: 'reference', label: 'Referência Rápida',    icon: BookOpen },
];

export default function Home() {
  const [tab, setTab] = useState('circuit');

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
              <h1 className="text-sm font-bold text-foreground tracking-tight">ElétricaCalc</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                NBR 5410 · NBR 5444 · NBR 14136
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
            v2026
          </span>
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
            ElétricaCalc — Calculadora para eletricistas e técnicos
          </p>
          <p className="text-xs text-muted-foreground">
            Baseado em NBR 5410 · NBR 5444 · NBR 14136 — Maio 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

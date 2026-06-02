import { useState } from 'react';
import { PlugZap, Lightbulb, ChevronDown, Info } from 'lucide-react';
import { ROOM_TYPES, TUE_POR_AMBIENTE, calcRoomPoints } from '../lib/electricalData';

const Select = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground appearance-none pr-8 focus:ring-1 focus:ring-ring"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
  </div>
);

const Input = ({ value, onChange, suffix }) => (
  <div className="relative">
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      min="1"
      step="0.5"
      className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring pr-12"
    />
    {suffix && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        {suffix}
      </span>
    )}
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = 'primary' }) => {
  const colorMap = {
    primary: 'text-primary',
    success: 'text-success',
    info:    'text-blue-400',
  };
  return (
    <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${colorMap[color]}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`text-3xl font-bold font-mono ${colorMap[color]}`}>{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
};

export default function RoomPoints() {
  const [roomType,    setRoomType]    = useState('sala');
  const [customName,  setCustomName]  = useState('');
  const [area,        setArea]        = useState(12);
  const [perimeter,   setPerimeter]   = useState(14);
  const [result,      setResult]      = useState(null);

  const selectedRoom = ROOM_TYPES.find(r => r.id === roomType);

  const handleCalc = () => {
    const res = calcRoomPoints({
      roomType,
      area:      Number(area),
      perimeter: Number(perimeter),
    });
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <PlugZap className="h-4 w-4" /> Dados do Ambiente
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roomType === 'personalizado' && (
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nome do Ambiente
              </label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="Ex: Lavabo, Edícula, Galpão..."
                className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tipo de Ambiente
            </label>
            <Select value={roomType} onChange={setRoomType}>
              {ROOM_TYPES.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Área do Cômodo
            </label>
            <Input value={area} onChange={setArea} suffix="m²" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Perímetro de Paredes
            </label>
            <Input value={perimeter} onChange={setPerimeter} suffix="m" />
          </div>
        </div>

        <button
          onClick={handleCalc}
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm mt-2"
        >
          Calcular Pontos
        </button>
      </div>

      {/* Resultados */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard icon={PlugZap}   label="Tomadas TUG (mínimo)"  value={result.minTug}            sub="NBR 5410"         color="primary" />
            <StatCard icon={Lightbulb} label="Pontos de Iluminação"  value={result.ilumPts}           sub="ponto(s) mínimos" color="success" />
            {result.maxSpacing && (
              <StatCard icon={Info}    label="Espaçamento máximo"    value={`${result.maxSpacing} m`} sub="entre tomadas"    color="info" />
            )}
          </div>

          {/* Observações normativas */}
          {result.notes.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Observações NBR 5410
              </p>
              {result.notes.map((n, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary mt-0.5">›</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          )}

          {/* Regra geral */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-primary mb-1">Regra Geral — NBR 5410</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nenhum ponto da parede deve estar a mais de{' '}
              <strong className="text-foreground">1,80 m</strong> de uma tomada. Para paredes com
              comprimento superior a <strong className="text-foreground">3,5 m</strong>, exige-se uma
              tomada adicional a cada <strong className="text-foreground">5 m</strong> de parede
              contínua (medidos pelo perímetro interno do ambiente).
            </p>
          </div>

          {/* Tabela TUE — exibida apenas para cozinha/área de serviço */}
          {selectedRoom?.hasTUE && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                TUE — Tomadas de Uso Específico
              </p>
              <p className="text-xs text-muted-foreground">
                Cada equipamento fixo abaixo exige{' '}
                <strong className="text-foreground">circuito exclusivo</strong>:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Equipamento</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Bitola</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Disjuntor</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Tensão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TUE_POR_AMBIENTE.map((t, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 text-foreground font-medium">{t.equipamento}</td>
                        <td className="py-2 text-muted-foreground font-mono">{t.bitola}</td>
                        <td className="py-2 text-primary font-mono">{t.disjuntor}</td>
                        <td className="py-2 text-muted-foreground">{t.tensao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

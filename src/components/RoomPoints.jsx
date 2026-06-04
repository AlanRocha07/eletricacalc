import { useState } from 'react';
import { PlugZap, Lightbulb, ChevronDown, Info } from 'lucide-react';
import { ROOM_TYPES, LUMINARIAS, TUE_POR_AMBIENTE, calcRoomPoints } from '../lib/electricalData';

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

const Input = ({ value, onChange, suffix, min, step }) => (
  <div className="relative">
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      min={min || "1"}
      step={step || "0.5"}
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
  const colorMap = { primary: 'text-primary', success: 'text-success', info: 'text-blue-400' };
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
  const [area,        setArea]        = useState(20);
  const [perimeter,   setPerimeter]   = useState(18);
  const [luminaria,   setLuminaria]   = useState('led20');
  const [customLux,   setCustomLux]   = useState('');
  const [result,      setResult]      = useState(null);

  const selectedRoom     = ROOM_TYPES.find(r => r.id === roomType);
  const selectedLuminaria = LUMINARIAS.find(l => l.id === luminaria);

  const handleCalc = () => {
    const res = calcRoomPoints({
      roomType,
      area:              Number(area),
      perimeter:         Number(perimeter),
      lumensByLuminaria: selectedLuminaria?.lm || 2000,
      customLux:         customLux ? Number(customLux) : null,
    });
    setResult(res);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <PlugZap className="h-4 w-4" /> Dados do Ambiente
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Tipo de ambiente */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo de Ambiente</label>
            <Select value={roomType} onChange={v => { setRoomType(v); setCustomLux(''); }}>
              {ROOM_TYPES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </Select>
          </div>

          {/* Nome personalizado */}
          {roomType === 'personalizado' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome do Ambiente</label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="Ex: Lavabo, Edícula, Depósito..."
                className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring"
              />
            </div>
          )}

          {/* Área */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Área do Cômodo</label>
            <Input value={area} onChange={setArea} suffix="m²" />
          </div>

          {/* Perímetro */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perímetro de Paredes</label>
            <Input value={perimeter} onChange={setPerimeter} suffix="m" />
          </div>

          {/* Luminária */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tipo de Luminária
            </label>
            <Select value={luminaria} onChange={setLuminaria}>
              {LUMINARIAS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </Select>
          </div>

          {/* Nível de lux personalizado (opcional) */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Iluminância desejada (lux) —{' '}
              <span className="text-primary normal-case">
                padrão para {selectedRoom?.label}: {selectedRoom?.lux} lux
              </span>
            </label>
            <Input
              value={customLux}
              onChange={setCustomLux}
              suffix="lux"
              min="50"
              step="50"
            />
            <p className="text-xs text-muted-foreground">
              Deixe em branco para usar o valor padrão da NBR ISO/CIE 8995-1 para este ambiente.
            </p>
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
            <StatCard icon={PlugZap}   label="Tomadas TUG (mínimo)"     value={result.minTug}   sub="NBR 5410"         color="primary" />
            <StatCard icon={Lightbulb} label="Luminárias necessárias"   value={result.ilumPts}  sub="pontos mínimos"   color="success" />
            {result.maxSpacing && (
              <StatCard icon={Info}    label="Espaçamento máximo"       value={`${result.maxSpacing} m`} sub="entre tomadas" color="info" />
            )}
          </div>

          {/* Memória de cálculo luminotécnico */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              Memória de Cálculo — Iluminação
            </p>
            <div className="font-mono text-xs text-muted-foreground bg-muted/30 rounded-lg p-4 space-y-1.5 leading-relaxed">
              <p>Fórmula: N = (E × A) / (φ × Fu × Fm)</p>
              <p>E  = {customLux || result.E} lux &nbsp;(iluminância — NBR ISO/CIE 8995-1)</p>
              <p>A  = {area} m²</p>
              <p>φ  = {selectedLuminaria?.lm?.toLocaleString('pt-BR')} lm &nbsp;({selectedLuminaria?.label})</p>
              <p>Fu = 0,60 &nbsp;(fator de utilização — padrão conservador)</p>
              <p>Fm = 0,80 &nbsp;(fator de manutenção)</p>
              <p className="border-t border-border/40 pt-2 mt-2">
                N = ({customLux || result.E} × {area}) / ({selectedLuminaria?.lm} × 0,60 × 0,80) ={' '}
                <strong className="text-foreground">{result.ilumPts} luminária(s)</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Fluxo luminoso total necessário: {result.fluxoTotal.toLocaleString('pt-BR')} lm
              </p>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              ⚠ Estimativa para projeto preliminar. Para projetos formais, realize cálculo
              luminotécnico completo com software específico (DIALux, Relux, etc.).
            </p>
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

          {/* Regra geral TUG */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-primary mb-1">Regra Geral — Tomadas (NBR 5410)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nenhum ponto da parede deve estar a mais de{' '}
              <strong className="text-foreground">1,80 m</strong> de uma tomada. Para paredes com
              comprimento superior a <strong className="text-foreground">3,5 m</strong>, exige-se uma
              tomada adicional a cada <strong className="text-foreground">5 m</strong> de parede
              contínua (perímetro interno).
            </p>
          </div>

          {/* Tabela TUE — apenas cozinha/área de serviço */}
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

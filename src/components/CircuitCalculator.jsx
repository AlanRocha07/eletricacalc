import { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { CIRCUIT_TYPES, METODO_LABELS, calcCircuit } from '../lib/electricalData';

// ── Componentes de formulário ────────────────────────────────────────────────

const Field = ({ label, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

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

const Input = ({ value, onChange, type = 'number', min, step, suffix, placeholder }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      min={min}
      step={step}
      placeholder={placeholder}
      className={`w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring ${suffix ? 'pr-12' : 'pr-3'}`}
    />
    {suffix && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        {suffix}
      </span>
    )}
  </div>
);

// ── Card de resultado individual ─────────────────────────────────────────────

const ResultCard = ({ label, value, unit, highlight, status }) => {
  const base  = 'flex flex-col gap-0.5 p-3 rounded-lg border';
  const color = status === 'ok'
    ? 'border-success/30 bg-success/5'
    : status === 'err'
    ? 'border-destructive/30 bg-destructive/5'
    : highlight
    ? 'border-primary/40 bg-primary/5'
    : 'border-border bg-muted/30';

  return (
    <div className={`${base} ${color}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-semibold font-mono ${highlight ? 'text-primary' : 'text-foreground'}`}>
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
};

// ── Badge de conformidade ────────────────────────────────────────────────────

function ConformityBadge({ ok, label }) {
  return (
    <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs ${
      ok
        ? 'bg-success/10 border border-success/20 text-success'
        : 'bg-destructive/10 border border-destructive/20 text-destructive'
    }`}>
      {ok
        ? <CheckCircle className="h-3.5 w-3.5 shrink-0" />
        : <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
      }
      {label}
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function CircuitCalculator() {
  const [circuitType, setCircuitType] = useState('iluminacao');
  const [customName,  setCustomName]  = useState('');
  const [btu,         setBtu]         = useState('');
  const [power,       setPower]       = useState(1000);
  const [voltage,     setVoltage]     = useState(127);
  const [fp,          setFp]          = useState(0.92);
  const [length,      setLength]      = useState(15);
  const [method,      setMethod]      = useState('B1');
  const [result,      setResult]      = useState(null);

  // Ao trocar o tipo de circuito, pré-preenche os campos com valores padrão
  const handleTypeChange = (id) => {
    const t = CIRCUIT_TYPES.find(c => c.id === id);
    if (t) {
      setCircuitType(id);
      if (id !== 'outro') {
        setPower(t.defaultPower);
        setVoltage(t.defaultV);
        setFp(t.defaultFP);
        setBtu('');
      }
    }
  };

  // Dispara o cálculo — todos os valores são calculados em electricalData.js
  const handleCalc = () => {
    const res = calcCircuit({
      power:   Number(power),
      voltage: Number(voltage),
      fp:      Number(fp),
      length:  Number(length),
      method,
    });
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Formulário de entrada */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <Zap className="h-4 w-4" /> Dados do Circuito
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tipo de Circuito">
            <Select value={circuitType} onChange={handleTypeChange}>
              {CIRCUIT_TYPES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </Select>
          </Field>

          {circuitType === 'outro' && (
            <Field label="Nome do Circuito">
              <Input value={customName} onChange={setCustomName} type="text" />
            </Field>
          )}

          {(circuitType === 'ar_cond' || circuitType === 'central_ar') && (
            <Field
              label="Potência do Aparelho"
              hint={btu
                ? `≈ ${Math.round(Number(btu) / 3.412)} W (${Number(btu).toLocaleString('pt-BR')} BTU/h ÷ 3,412)`
                : 'Deixe em branco para usar watts diretamente'}
            >
              <Input
                value={btu}
                onChange={(v) => { setBtu(v); if (v) setPower(Math.round(Number(v) / 3.412)); }}
                min="1000"
                step="100"
                suffix="BTU/h"
              />
            </Field>
          )}

          <Field label="Método de Instalação">
            <Select value={method} onChange={setMethod}>
              {Object.entries(METODO_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>

          <Field label="Potência Ativa">
            <Input value={power} onChange={setPower} min="1" suffix="W" />
          </Field>

          <Field label="Tensão">
            <Select value={voltage} onChange={setVoltage}>
              <option value={127}>127 V</option>
              <option value={220}>220 V</option>
              <option value={380}>380 V (trifásico)</option>
            </Select>
          </Field>

          <Field label="Fator de Potência (cos φ)" hint="1,0 para cargas resistivas puras">
            <Input value={fp} onChange={setFp} min="0.1" step="0.01" suffix="cos φ" />
          </Field>

          <Field label="Comprimento do Circuito" hint="Distância do QD ao ponto mais distante">
            <Input value={length} onChange={setLength} min="1" suffix="m" />
          </Field>
        </div>

        <button
          onClick={handleCalc}
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm mt-2"
        >
          Calcular Dimensionamento
        </button>
      </div>

      {/* Resultados */}
      {result && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 animate-fade-in">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
            Resultados — NBR 5410
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard label="Corrente Monofásica (Ip)" value={result.Ip_mono} unit="A" highlight />
            <ResultCard label="Corrente Trifásica (Ip)"  value={result.Ip_tri}  unit="A" highlight />
            <ResultCard label="Potência Aparente (S)"    value={result.S}       unit="kVA" />
            <ResultCard label="Bitola Mínima"            value={`${result.bitolaFinal} mm²`} highlight />
            <ResultCard label="Ampacidade (Iz)"          value={result.iz}      unit="A" />
            <ResultCard label="Disjuntor Recomendado"    value={`${result.breaker} A`} unit="Curva C" highlight />
          </div>

          {/* Queda de tensão */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Queda de Tensão
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultCard label="ΔU Monofásico"  value={`${result.dU_mono} V`}     status={result.ok_mono ? 'ok' : 'err'} />
              <ResultCard label="ΔU Mono (%)"    value={`${result.dU_mono_pct}%`}   status={result.ok_mono ? 'ok' : 'err'} />
              <ResultCard label="ΔU Trifásico"   value={`${result.dU_tri} V`}      status={result.ok_tri  ? 'ok' : 'err'} />
              <ResultCard label="ΔU Tri (%)"     value={`${result.dU_tri_pct}%`}   status={result.ok_tri  ? 'ok' : 'err'} />
            </div>
          </div>

          {/* Badges de conformidade */}
          <div className="space-y-2">
            <ConformityBadge
              ok={result.ok_mono}
              label={`Queda monofásica ${result.dU_mono_pct}% — limite NBR 5410: 4%`}
            />
            <ConformityBadge
              ok={result.ok_tri}
              label={`Queda trifásica ${result.dU_tri_pct}% — limite NBR 5410: 4%`}
            />
            {result.bitolaQt > result.minBitola && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-foreground">
                  Bitola aumentada de <strong>{result.minBitola} mm²</strong> (por corrente) para{' '}
                  <strong>{result.bitolaFinal} mm²</strong> para atender à queda de tensão máxima
                  de 4% — NBR 5410 Tab. 47.
                </p>
              </div>
            )}
          </div>

          {/* Fórmulas utilizadas (expansível) */}
          <details className="group">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none">
              Ver fórmulas utilizadas ▾
            </summary>
            <div className="mt-3 font-mono text-xs text-muted-foreground bg-muted/30 rounded-lg p-4 space-y-1.5 leading-relaxed">
              <p>Ip (mono) = P / (V × FP) = {power} / ({voltage} × {fp}) = <strong className="text-foreground">{result.Ip_mono} A</strong></p>
              <p>Ip (tri)  = P / (√3 × V × FP) = {power} / (1,732 × {voltage} × {fp}) = <strong className="text-foreground">{result.Ip_tri} A</strong></p>
              <p>S (VA)    = P / FP = {power} / {fp} = <strong className="text-foreground">{(Number(power)/Number(fp)).toFixed(0)} VA</strong></p>
              <p>ΔU (mono) = (2 × ρ × L × I) / S = (2 × 0,0172 × {length} × {result.Ip_mono}) / {result.bitolaFinal}</p>
              <p>ΔU (tri)  = (√3 × ρ × L × I) / S = (1,732 × 0,0172 × {length} × {result.Ip_mono}) / {result.bitolaFinal}</p>
              <p>ρ cobre = 0,0172 Ω·mm²/m (20°C) — NBR 5410</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

import { AMPACIDADE, METODO_LABELS } from '../lib/electricalData';

// ── Componentes de layout ────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div className="bg-card border border-border rounded-xl overflow-hidden">
    <div className="bg-primary/10 border-b border-border px-5 py-3">
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border">
          {headers.map((h, i) => (
            <th key={i} className="text-left py-2 pr-4 text-muted-foreground font-medium whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={`border-b border-border/40 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
            {row.map((cell, j) => (
              <td
                key={j}
                className={`py-2 pr-4 whitespace-nowrap ${
                  j === 0
                    ? 'text-foreground font-semibold font-mono'
                    : 'text-muted-foreground'
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ColorDot = ({ color }) => (
  <span
    className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-white/10"
    style={{ background: color }}
  />
);

// ── Componente principal ─────────────────────────────────────────────────────

export default function QuickReference() {
  const bitolas  = Object.keys(AMPACIDADE).map(Number).sort((a, b) => a - b);
  const metodos  = Object.keys(METODO_LABELS);

  // Gera linhas da tabela de ampacidade dinamicamente a partir dos dados
  const ampRows = bitolas.map(b => [
    `${b} mm²`,
    ...metodos.map(m => {
      const idx = { A1: 0, B1: 1, C: 2, E: 3 }[m];
      return `${AMPACIDADE[b][idx]} A`;
    }),
  ]);

  return (
    <div className="space-y-5">

      {/* Ampacidade */}
      <Section title="Ampacidade — Capacidade de Corrente (NBR 5410 Tab. B.52.12)">
        <p className="text-xs text-muted-foreground mb-3">
          Cobre / PVC / 30°C — sem fatores de correção. Para temperatura diferente, agrupamento ou
          isolação XLPE, aplique os fatores das tabelas B.52.14 a B.52.20 da NBR 5410.
        </p>
        <Table
          headers={['Bitola', 'A1 — Embutido', 'B1 — Eletroduto', 'C — Sobre parede', 'E — Ao ar livre']}
          rows={ampRows}
        />
      </Section>

      {/* Cores dos condutores */}
      <Section title="Identificação de Condutores — Cores (NBR 5410 Seção 6.1)">
        <Table
          headers={['Condutor', 'Cor', 'Tensão', 'Observação']}
          rows={[
            ['Fase R',           <><ColorDot color="#ef4444"/>Vermelho</>,     '127/220 V', 'Identificação trifásica'],
            ['Fase S',           <><ColorDot color="#f97316"/>Laranja</>,      '127/220 V', 'Identificação trifásica'],
            ['Fase T',           <><ColorDot color="#1d4ed8"/>Azul escuro</>,  '127/220 V', 'Identificação trifásica'],
            ['Fase única (mono)',<><ColorDot color="#ef4444"/>Vermelho</>,     '127/220 V', 'Preto, marrom ou cinza também'],
            ['Neutro',           <><ColorDot color="#93c5fd"/>Azul claro</>,   '0 V (ref.)','Exclusivo para neutro'],
            ['Terra (PE)',       <><ColorDot color="#16a34a"/>Verde/Amarelo</>, '0 V (terra)','JAMAIS usar como fase ou neutro'],
          ]}
        />
        <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          ⚠ PROIBIÇÃO ABSOLUTA — O condutor Verde/Amarelo JAMAIS pode ser fase ou neutro (NBR 5410 Seção 6.1).
        </div>
        <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
          A NBR 5410 não impõe cores fixas por fase — vermelho (R), laranja (S) e azul escuro (T) são prática consolidada de mercado.
        </div>
      </Section>

      {/* Disjuntores */}
      <Section title="Dimensionamento de Disjuntores (NBR 5410 Seção 9.10 — IEC 60898)">
        <Table
          headers={['In (A)', 'Uso típico', 'Bitola associada', 'Curva']}
          rows={[
            ['6 A',  'Iluminação baixa carga',     '1,5 mm²',                          'B ou C'],
            ['10 A', 'Iluminação geral',            '1,5 mm²',                          'B ou C'],
            ['16 A', 'TUG / iluminação pesada',     '2,5 mm²',                          'C'],
            ['20 A', 'TUG / TUE padrão',            '2,5 mm²',                          'C'],
            ['25 A', 'TUE / equipamento pesado',    '4,0 mm²',                          'C'],
            ['32 A', 'Chuveiro, forno, AC',         '4,0 mm² (C/E) / 6,0 (A1/B1)',     'C'],
            ['40 A', 'Alimentadores',               '6,0 mm² (C/E) / 10 (A1/B1)',      'C'],
            ['50 A', 'Alimentadores / QD',          '10–16 mm²',                        'C'],
            ['63 A', 'Entrada / alimentador',       '16–25 mm²',                        'C'],
          ]}
        />
        <div className="mt-3 text-xs text-muted-foreground font-mono bg-muted/30 rounded-lg p-3">
          Regra: <strong className="text-foreground">IP ≤ IN ≤ IZ</strong> — Corrente de projeto ≤ In do disjuntor ≤ ampacidade do cabo.
          A Iz depende do método de instalação — consulte a tabela acima.
        </div>
      </Section>

      {/* Curvas de disparo */}
      <Section title="Curvas de Disparo">
        <Table
          headers={['Curva', 'Disparo magnético', 'Aplicação típica']}
          rows={[
            ['B', '3–5 × In',   'Iluminação, cargas resistivas'],
            ['C', '5–10 × In',  'Uso geral, residencial, comercial (padrão BR)'],
            ['D', '10–20 × In', 'Motores, transformadores, UPS'],
          ]}
        />
      </Section>

      {/* Queda de tensão */}
      <Section title="Queda de Tensão Admissível (NBR 5410 — Tab. 47)">
        <Table
          headers={['Trecho', 'Limite', '127 V (V)', '220 V (V)', '380 V (V)']}
          rows={[
            ['Ramal de alimentação',  '≤ 3%', '3,81 V',  '6,60 V',  '11,40 V'],
            ['Alimentadores internos','≤ 2%', '2,54 V',  '4,40 V',  '7,60 V'],
            ['Circuitos terminais',   '≤ 4%', '5,08 V',  '8,80 V',  '15,20 V'],
            ['Total (acumulado)',      '≤ 7%', '8,89 V',  '15,40 V', '26,60 V'],
          ]}
        />
      </Section>

      {/* Fórmulas */}
      <Section title="Fórmulas Essenciais (NBR 5410 — Cálculo Elétrico)">
        <div className="space-y-3">
          {[
            ['Corrente monofásica',  'Ip = P / (V × FP)'],
            ['Corrente trifásica',   'Ip = P / (√3 × V × FP)'],
            ['ΔU monofásico',        'ΔU = (2 × ρ × L × I) / S'],
            ['ΔU trifásico',         'ΔU = (√3 × ρ × L × I) / S'],
            ['Seção mínima por ΔU',  'S = (2 × ρ × L × I) / ΔUmáx'],
            ['Potência aparente',    'S = P / FP = √(P² + Q²)'],
            ['Demanda de projeto',   'Dp = Pi × fd'],
          ].map(([label, formula]) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-border/40 pb-2"
            >
              <span className="text-xs text-muted-foreground w-44 shrink-0">{label}</span>
              <code className="text-sm text-primary font-mono">{formula}</code>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            ρ (cobre, 20°C) = <strong className="text-foreground">0,0172 Ω·mm²/m</strong>
            &nbsp;|&nbsp;
            ρ (alumínio, 20°C) = <strong className="text-foreground">0,0282 Ω·mm²/m</strong>
          </p>
        </div>
      </Section>

      {/* Tomadas NBR 14136 */}
      <Section title="Tomadas e Plugues — Padrão Brasileiro (NBR 14136:2012)">
        <Table
          headers={['Tipo', 'Pinos', 'Corrente', 'Diâmetro', 'Tensão', 'Aplicação']}
          rows={[
            ['Tipo 1', '2P+T', '10 A', '4 mm',   '127/220 V', 'Eletrodomésticos leves, carregadores'],
            ['Tipo 2', '2P+T', '20 A', '4,8 mm', '127/220 V', 'Equipamentos pesados, eletrodomésticos de potência'],
          ]}
        />
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
          Tomadas 20 A (Ø 4,8 mm) <strong className="text-destructive">NÃO</strong> aceitam plugues 10 A
          (Ø 4 mm) e vice-versa. Padrão obrigatório desde 01/01/2013.
        </div>
      </Section>

      {/* Aterramento */}
      <Section title="Aterramento e Proteção — Resumo (NBR 5410 · IEC 60364)">
        <p className="text-xs text-muted-foreground mb-3">Condutor de proteção (PE) — bitola mínima conforme NBR 5410 Tabela 54.2</p>
        <Table
          headers={['Fase (S)', 'PE mínimo']}
          rows={[
            ['S ≤ 16 mm²',        '= S (igual à fase)'],
            ['16 < S ≤ 35 mm²',   '16 mm²'],
            ['S > 35 mm²',        'S / 2 → arredondar para bitola normalizada ≥ S/2'],
          ]}
        />
        <div className="mt-3" />
        <Table
          headers={['Sistema', 'Descrição', 'DR obrigatório?']}
          rows={[
            ['TN-S',   'Neutro e PE separados em todo o trajeto — preferido em instalações novas', 'Recomendado'],
            ['TN-C',   'Neutro e PE combinados (PEN) — redes de distribuição antigas',              'Não aplicável'],
            ['TN-C-S', 'PEN na entrada, TN-S interno — residencial com ramal TN-C',                'Recomendado'],
            ['TT',     'Terra independente na instalação — rurais e isoladas',                      'Obrigatório'],
            ['IT',     'Neutro isolado — hospitais, minas, segurança crítica',                      'Monitor de isolação'],
          ]}
        />
        <div className="mt-3 text-xs text-muted-foreground font-mono bg-muted/30 rounded-lg p-3">
          DR (dispositivo diferencial-residual): <strong className="text-foreground">30 mA</strong> proteção pessoal &nbsp;|&nbsp;
          <strong className="text-foreground">10 mA</strong> equipamentos sensíveis &nbsp;|&nbsp;
          <strong className="text-foreground">300 mA</strong> proteção contra incêndio
        </div>
      </Section>

      {/* SPDA */}
      <Section title="SPDA — Proteção contra Descargas Atmosféricas (NBR 5419:2015)">
        <p className="text-xs text-muted-foreground mb-3">Níveis de Proteção (NP) — NBR 5419-1:2015</p>
        <Table
          headers={['NP', 'Eficiência', 'Corrente mín.', 'Corrente máx.', 'Aplicação típica']}
          rows={[
            ['NP I',  '99%', '3 kA',  '200 kA', 'Hospitais, explosivos, áreas de risco crítico'],
            ['NP II', '97%', '5 kA',  '150 kA', 'Indústrias, edifícios com alto risco de incêndio'],
            ['NP III','91%', '10 kA', '100 kA', 'Edificações residenciais altas, prédios comerciais'],
            ['NP IV', '84%', '16 kA', '100 kA', 'Edificações de baixo risco, residências isoladas'],
          ]}
        />
        <div className="mt-3" />
        <p className="text-xs text-muted-foreground mb-2">Métodos de posicionamento dos captores — NBR 5419-3:2015</p>
        <Table
          headers={['Método', 'NP I', 'NP II', 'NP III', 'NP IV']}
          rows={[
            ['Esfera rolante (raio)', '20 m', '30 m', '45 m', '60 m'],
            ['Malha (gaiola Faraday)', '5×5 m', '10×10 m', '15×15 m', '20×20 m'],
          ]}
        />
        <div className="mt-3" />
        <p className="text-xs text-muted-foreground mb-2">DPS — Proteção contra surtos por zona (NBR IEC 61643-11)</p>
        <Table
          headers={['Zona (LPZ)', 'Local', 'Tipo de DPS', 'Iimp mínimo']}
          rows={[
            ['LPZ 0→1', 'Entrada da edificação (QGBT)', 'Tipo 1 (classe I)',   '≥ 12,5 kA (10/350 µs)'],
            ['LPZ 1→2', 'Quadros de distribuição',      'Tipo 2 (classe II)',  '≥ 5 kA (8/20 µs)'],
            ['LPZ 2→3', 'Próximo a equipamentos sensíveis', 'Tipo 3 (classe III)', '≥ 1,5 kA (8/20 µs)'],
          ]}
        />
        <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          ⚠ Toda instalação com SPDA externo deve ter obrigatoriamente DPS Tipo 1 no ponto de entrada da energia elétrica — NBR 5410 item 5.4.3 e NBR 5419-4:2015.
        </div>
      </Section>

    </div>
  );
}

// NBR 5410 / NBR 5444 / NBR 14136 — Tabelas normativas embutidas
// Lógica de cálculo idêntica à versão original — sem dependências externas

export const RHO_COPPER = 0.0172; // Ω·mm²/m a 20°C

// Ampacidade por bitola e método de instalação (NBR 5410 Tab. B.52.12)
// Cabo cobre / PVC / 30°C / 2 condutores carregados
// Índices: [A1, B1, C, E]
export const AMPACIDADE = {
  1.5:  [13,   15.5, 17.5, 20],
  2.5:  [18,   21,   24,   27],
  4.0:  [24,   28,   32,   37],
  6.0:  [31,   36,   41,   47],
  10:   [43,   50,   57,   65],
  16:   [57,   68,   76,   87],
  25:   [75,   89,   101,  114],
  35:   [92,   110,  125,  141],
  50:   [110,  134,  151,  168],
};

export const METODO_LABELS = {
  A1: 'A1 — Embutido em parede',
  B1: 'B1 — Eletroduto embutido',
  C:  'C — Sobre parede',
  E:  'E — Ao ar livre',
};

export const METODO_IDX = { A1: 0, B1: 1, C: 2, E: 3 };

// Correntes nominais padronizadas de disjuntores (IEC 60898)
export const DISJUNTORES = [6, 10, 16, 20, 25, 32, 40, 50, 63];

// Tipos de circuito com valores padrão para pré-preenchimento dos campos
export const CIRCUIT_TYPES = [
  { id: 'iluminacao',  label: 'Iluminação geral',            defaultPower: 1000,  defaultV: 127, defaultFP: 0.92, defaultCurve: 'B' },
  { id: 'tug',         label: 'Tomadas uso geral (TUG)',      defaultPower: 1500,  defaultV: 127, defaultFP: 1.0,  defaultCurve: 'C' },
  { id: 'tue_baixa',   label: 'TUE — Baixa potência',         defaultPower: 1500,  defaultV: 220, defaultFP: 1.0,  defaultCurve: 'C' },
  { id: 'chuveiro',    label: 'Chuveiro elétrico',            defaultPower: 5500,  defaultV: 220, defaultFP: 1.0,  defaultCurve: 'C' },
  { id: 'ar_cond',     label: 'Ar-condicionado (split)',       defaultPower: 1400,  defaultV: 220, defaultFP: 0.92, defaultCurve: 'C' },
  { id: 'central_ar',  label: 'Central de ar',                 defaultPower: 3500,  defaultV: 220, defaultFP: 0.92, defaultCurve: 'C' },
  { id: 'fogao',       label: 'Fogão / Forno embutido',       defaultPower: 6000,  defaultV: 220, defaultFP: 1.0,  defaultCurve: 'C' },
  { id: 'lava',        label: 'Máquina de lavar roupa',       defaultPower: 1500,  defaultV: 220, defaultFP: 0.92, defaultCurve: 'C' },
  { id: 'alimentador', label: 'Alimentador (QD secundário)',  defaultPower: 10000, defaultV: 220, defaultFP: 0.92, defaultCurve: 'C' },
  { id: 'outro',       label: 'Outro (personalizado)',         defaultPower: 1000,  defaultV: 220, defaultFP: 1.0,  defaultCurve: 'C' },
];

// Ambientes para cálculo de pontos por ambiente
export const ROOM_TYPES = [
  { id: 'sala',          label: 'Sala / Quarto',               hasTUE: false },
  { id: 'cozinha',       label: 'Cozinha / Área de serviço',   hasTUE: true  },
  { id: 'banheiro',      label: 'Banheiro',                    hasTUE: false },
  { id: 'garagem',       label: 'Garagem',                     hasTUE: false },
  { id: 'externa',       label: 'Área externa coberta',        hasTUE: false },
  { id: 'personalizado', label: 'Personalizado',               hasTUE: false },
];

// Tabela TUE para exibição na aba de pontos por ambiente (cozinha)
export const TUE_POR_AMBIENTE = [
  { equipamento: 'Chuveiro elétrico',        bitola: '4,0 mm² (C/E) / 6,0 mm² (A1/B1)', disjuntor: '30 A',    tensao: '220 V' },
  { equipamento: 'Forno de micro-ondas',     bitola: '2,5 mm²',                           disjuntor: '20 A',    tensao: '127/220 V' },
  { equipamento: 'Forno elétrico embutido',  bitola: '4,0 mm² (C/E) / 6,0 mm² (A1/B1)', disjuntor: '20–30 A', tensao: '220 V' },
  { equipamento: 'Geladeira',                bitola: '2,5 mm²',                           disjuntor: '20 A',    tensao: '127/220 V' },
  { equipamento: 'Ar-condicionado',          bitola: '2,5–6,0 mm²',                       disjuntor: '20–30 A', tensao: '220 V' },
  { equipamento: 'Máquina de lavar',         bitola: '2,5 mm²',                           disjuntor: '20 A',    tensao: '127/220 V' },
];

// ─── CÁLCULO DE CIRCUITO ────────────────────────────────────────────────────
// Recebe os parâmetros do circuito e retorna todos os valores calculados.
// NÃO faz tabelamento — cada valor é resultado de fórmula aplicada aos inputs.

export function calcCircuit({ power, voltage, fp, length, method }) {
  const methodIdx = METODO_IDX[method];

  // 1. Corrente de projeto (A)
  const Ip_mono = power / (voltage * fp);                          // I = P / (V × FP)
  const Ip_tri  = power / (Math.sqrt(3) * voltage * fp);           // I = P / (√3 × V × FP)

  // 2. Potência aparente (VA)
  const S = power / fp;

  // 3. Disjuntor mínimo: primeiro valor padronizado acima de Ip_mono
  const breaker = DISJUNTORES.find(d => d >= Ip_mono) ?? DISJUNTORES[DISJUNTORES.length - 1];

  // 4. Bitola mínima pela corrente: menor bitola cuja ampacidade >= Ip_mono
  //    no método de instalação escolhido
  const bitolas = Object.keys(AMPACIDADE).map(Number).sort((a, b) => a - b);
  let minBitola = bitolas[bitolas.length - 1]; // começa na maior como fallback
  for (const b of bitolas) {
    if (AMPACIDADE[b][methodIdx] >= Ip_mono) { minBitola = b; break; }
  }

  // 5. Seção mínima pela queda de tensão (limite 4% — NBR 5410 Tab. 47)
  //    ΔUmáx = V × 4% → S_min = (2 × ρ × L × I) / ΔUmáx
  const dUmax   = voltage * 0.04;
  const S_min_qt = (2 * RHO_COPPER * length * Ip_mono) / dUmax;

  // Bitola normalizada mínima para atender a queda de tensão
  let bitolaQt = bitolas[bitolas.length - 1];
  for (const b of bitolas) {
    if (b >= S_min_qt) { bitolaQt = b; break; }
  }

  // 6. Bitola final = maior entre as duas exigências (corrente e queda de tensão)
  const bitolaFinal = Math.max(minBitola, bitolaQt);

  // 7. Ampacidade real da bitola final no método escolhido
  const iz = AMPACIDADE[bitolaFinal][methodIdx];

  // 8. Queda de tensão real com a bitola final
  const dU_mono_f     = (2 * RHO_COPPER * length * Ip_mono) / bitolaFinal;
  const dU_tri_f      = (Math.sqrt(3) * RHO_COPPER * length * Ip_mono) / bitolaFinal;
  const dU_mono_f_pct = (dU_mono_f / voltage) * 100;
  const dU_tri_f_pct  = (dU_tri_f  / voltage) * 100;

  return {
    Ip_mono:      Ip_mono.toFixed(2),
    Ip_tri:       Ip_tri.toFixed(2),
    S:            (S / 1000).toFixed(3),
    breaker,
    bitolaFinal,
    iz,
    dU_mono:      dU_mono_f.toFixed(2),
    dU_tri:       dU_tri_f.toFixed(2),
    dU_mono_pct:  dU_mono_f_pct.toFixed(2),
    dU_tri_pct:   dU_tri_f_pct.toFixed(2),
    ok_mono:      dU_mono_f_pct <= 4,
    ok_tri:       dU_tri_f_pct  <= 4,
    S_min_qt:     S_min_qt.toFixed(2),
    bitolaQt,
    minBitola,
  };
}

// ─── CÁLCULO DE PONTOS POR AMBIENTE ────────────────────────────────────────

export function calcRoomPoints({ roomType, area, perimeter }) {
  let minTug = 0, maxSpacing = null, ilumPts = 1, notes = [];

  if (roomType === 'sala') {
    if (area <= 6) {
      minTug = 1;
    } else if (area <= 10) {
      minTug = 2; maxSpacing = 3.5;
    } else {
      minTug = Math.max(1, Math.ceil(perimeter / 5));
      maxSpacing = 3.5;
      ilumPts = 2;
      notes.push('Cômodo >10 m²: 1 tomada a cada 5 m de parede — arredondar para cima.');
    }
  } else if (roomType === 'cozinha') {
    minTug = 3; maxSpacing = 1.0;
    notes.push('TUE obrigatório para cada equipamento fixo.');
    notes.push('Espaçamento máximo de 1,0 m da bancada.');
  } else if (roomType === 'banheiro') {
    minTug = 1;
    notes.push('Zona 2 — IP44 mínimo. Proibido zonas 0/1.');
    notes.push('DR 30 mA obrigatório.');
  } else if (roomType === 'garagem') {
    minTug = 1;
  } else if (roomType === 'externa') {
    minTug = 1;
    notes.push('IP mínimo conforme local (≥ IP44 para área coberta).');
  } else if (roomType === 'personalizado') {
    minTug = Math.max(1, Math.ceil(perimeter / 5));
    ilumPts = area > 10 ? 2 : 1;
    notes.push('Cálculo pela regra geral: 1 tomada a cada 5 m de parede (perímetro).');
    notes.push('Ajuste conforme as necessidades específicas do ambiente.');
  }

  return { minTug, maxSpacing, ilumPts, notes };
}

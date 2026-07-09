/* ============================================================
   Distrito OS — Stores v0.2
   Armazenamento separado por domínio: Produtos, Ingredientes,
   Fichas Técnicas. Cada store é independente do storage.js
   legado (que persiste pedidos, finanças, clientes, etc.).
   ============================================================ */

const STORE_KEYS = {
  PRODUTOS:     'distrito-produtos-v1',
  INGREDIENTES: 'distrito-ingredientes-v1',
  FICHAS:       'distrito-fichas-v1',
};

/* ── Domínio: Categorias e Unidades ──────────────────────────── */

const CATEGORIAS_PRODUTO = [
  'Batatas', 'Caldos', 'Aperitivos', 'Pratos', 'Combos', 'Bebidas', 'Sobremesas', 'Outros',
];

const CATEGORIAS_INGREDIENTE = [
  'Proteínas', 'Vegetais', 'Laticínios', 'Grãos e Farinhas',
  'Temperos', 'Embalagens', 'Bebidas', 'Outros',
];

const UNIDADES = ['g', 'kg', 'ml', 'L', 'un', 'cx', 'sc'];

/* ── Store Factory ───────────────────────────────────────────── */

function makeStore(key, seedValue) {
  return {
    get() {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : structuredClone(seedValue);
      } catch {
        return structuredClone(seedValue);
      }
    },
    set(value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    clear() {
      localStorage.removeItem(key);
    },
  };
}

/* ── Conversão de Unidades ───────────────────────────────────── */

const _UNIT_MAP = {
  g:  { g: 1,     kg: 0.001 },
  kg: { g: 1000,  kg: 1     },
  ml: { ml: 1,    L: 0.001  },
  L:  { ml: 1000, L: 1      },
};

function convertUnits(from, to) {
  if (from === to) return 1;
  return _UNIT_MAP[from]?.[to] ?? null;
}

function compatibleUnits(u1, u2) {
  if (u1 === u2) return true;
  return convertUnits(u1, u2) !== null;
}

function calcIngredienteCost(ingrediente, qty, unit) {
  const { custoUnitario, unidade } = ingrediente;
  if (unit === unidade) return qty * custoUnitario;
  const factor = convertUnits(unit, unidade);
  if (factor === null) return null;
  return qty * factor * custoUnitario;
}

/* ── Seed Data ───────────────────────────────────────────────── */

const SEED_PRODUTOS = [
  {
    id: 'p-001', nome: 'Batata Cheddar', categoria: 'Batatas',
    descricao: 'Batata frita crocante com molho cheddar cremoso',
    precoVenda: 38, ativo: true, tempoPreparo: 12, peso: 350,
    codigo: 'BAT-CH', dataCadastro: '2026-07-01', foto: '',
  },
  {
    id: 'p-002', nome: 'Batata Bacon', categoria: 'Batatas',
    descricao: 'Batata frita com bacon crocante e cebolinha',
    precoVenda: 42, ativo: true, tempoPreparo: 12, peso: 370,
    codigo: 'BAT-BA', dataCadastro: '2026-07-01', foto: '',
  },
  {
    id: 'p-003', nome: 'Caldo Verde', categoria: 'Caldos',
    descricao: 'Caldo cremoso de couve com linguiça artesanal',
    precoVenda: 28, ativo: true, tempoPreparo: 8, peso: 300,
    codigo: 'CAL-VR', dataCadastro: '2026-07-01', foto: '',
  },
  {
    id: 'p-004', nome: 'Bolinho de Aipim', categoria: 'Aperitivos',
    descricao: 'Bolinho crocante de aipim recheado com queijo',
    precoVenda: 32, ativo: true, tempoPreparo: 15, peso: 250,
    codigo: 'APE-AI', dataCadastro: '2026-07-01', foto: '',
  },
  {
    id: 'p-005', nome: 'Combo Família', categoria: 'Combos',
    descricao: 'Batata grande + 2 caldos + 2 refrigerantes',
    precoVenda: 89, ativo: true, tempoPreparo: 20, peso: 1200,
    codigo: 'COM-FA', dataCadastro: '2026-07-01', foto: '',
  },
];

const SEED_INGREDIENTES = [
  { id: 'i-001', nome: 'Batata Palito',     categoria: 'Vegetais',   unidade: 'kg', estoqueAtual: 12,  estoqueMinimo: 5,  custoUnitario: 4.50,  fornecedor: 'Supra Hortifrutti',      ativo: true },
  { id: 'i-002', nome: 'Cheddar Cremoso',   categoria: 'Laticínios', unidade: 'kg', estoqueAtual: 1.5, estoqueMinimo: 3,  custoUnitario: 22.00, fornecedor: 'Distribuidora Cheddar+', ativo: true },
  { id: 'i-003', nome: 'Bacon Fatiado',     categoria: 'Proteínas',  unidade: 'kg', estoqueAtual: 0.8, estoqueMinimo: 2,  custoUnitario: 38.00, fornecedor: 'Frigorífico São Jorge',  ativo: true },
  { id: 'i-004', nome: 'Aipim',             categoria: 'Vegetais',   unidade: 'kg', estoqueAtual: 6,   estoqueMinimo: 3,  custoUnitario: 3.80,  fornecedor: 'Supra Hortifrutti',      ativo: true },
  { id: 'i-005', nome: 'Couve',             categoria: 'Vegetais',   unidade: 'kg', estoqueAtual: 3,   estoqueMinimo: 2,  custoUnitario: 5.20,  fornecedor: 'Supra Hortifrutti',      ativo: true },
  { id: 'i-006', nome: 'Óleo de Soja',      categoria: 'Temperos',   unidade: 'L',  estoqueAtual: 8,   estoqueMinimo: 3,  custoUnitario: 7.50,  fornecedor: '',                       ativo: true },
  { id: 'i-007', nome: 'Costela Bovina',    categoria: 'Proteínas',  unidade: 'kg', estoqueAtual: 2,   estoqueMinimo: 4,  custoUnitario: 48.00, fornecedor: 'Frigorífico São Jorge',  ativo: true },
  { id: 'i-008', nome: 'Refrigerante 350ml',categoria: 'Bebidas',    unidade: 'un', estoqueAtual: 36,  estoqueMinimo: 12, custoUnitario: 2.50,  fornecedor: 'Bebidas & Cia',          ativo: true },
];

const SEED_FICHAS = [
  {
    id: 'f-001', produtoId: 'p-001', rendimento: 1,
    itens: [
      { ingredienteId: 'i-001', quantidade: 0.25, unidade: 'kg' },
      { ingredienteId: 'i-002', quantidade: 0.08, unidade: 'kg' },
      { ingredienteId: 'i-006', quantidade: 0.05, unidade: 'L'  },
    ],
  },
  {
    id: 'f-002', produtoId: 'p-002', rendimento: 1,
    itens: [
      { ingredienteId: 'i-001', quantidade: 0.25, unidade: 'kg' },
      { ingredienteId: 'i-003', quantidade: 0.06, unidade: 'kg' },
      { ingredienteId: 'i-006', quantidade: 0.05, unidade: 'L'  },
    ],
  },
  {
    id: 'f-003', produtoId: 'p-003', rendimento: 1,
    itens: [
      { ingredienteId: 'i-005', quantidade: 0.10, unidade: 'kg' },
    ],
  },
  {
    id: 'f-004', produtoId: 'p-004', rendimento: 1,
    itens: [
      { ingredienteId: 'i-004', quantidade: 0.12, unidade: 'kg' },
    ],
  },
];

/* ── Stores ──────────────────────────────────────────────────── */

const Stores = {
  produtos:     makeStore(STORE_KEYS.PRODUTOS,     SEED_PRODUTOS),
  ingredientes: makeStore(STORE_KEYS.INGREDIENTES, SEED_INGREDIENTES),
  fichas:       makeStore(STORE_KEYS.FICHAS,       SEED_FICHAS),
};

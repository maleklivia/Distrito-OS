const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const seedData = {
  settings: {
    businessName: "Distrito XVII",
    dailyGoal: 1500,
    cmvGoal: 32,
    stockAlerts: true,
    ifoodCommission: 23
  },
  products: [
    { id: 1,  name: "Batata Clássica",              price: 29.90, cost: 10.00, sold: 0, category: "Batatas" },
    { id: 2,  name: "Batata Cheddar & Bacon",        price: 39.90, cost: 16.10, sold: 0, category: "Batatas" },
    { id: 3,  name: "Batata XVII Suprema",           price: 54.90, cost: 20.50, sold: 0, category: "Batatas" },
    { id: 4,  name: "Frango Crocante",               price: 39.90, cost: 15.20, sold: 0, category: "Frango"  },
    { id: 5,  name: "Iscas de Frango",               price: 37.90, cost: 14.50, sold: 0, category: "Frango"  },
    { id: 6,  name: "Calabresa Acebolada",           price: 34.90, cost: 12.00, sold: 0, category: "Petiscos"},
    { id: 7,  name: "Torresmo Crocante",             price: 39.90, cost: 13.50, sold: 0, category: "Petiscos"},
    { id: 8,  name: "Caldo Verde",                   price: 22.90, cost:  8.50, sold: 0, category: "Caldos"  },
    { id: 9,  name: "Caldo de Aipim com Carne Seca", price: 24.90, cost: 10.20, sold: 0, category: "Caldos"  },
    { id: 10, name: "Maionese Verde",                price:  3.50, cost:  0.80, sold: 0, category: "Molhos"  },
    { id: 11, name: "Barbecue",                      price:  3.50, cost:  0.80, sold: 0, category: "Molhos"  },
    { id: 12, name: "Cheddar Extra",                 price:  5.90, cost:  1.20, sold: 0, category: "Molhos"  },
    { id: 13, name: "Coca-Cola Lata 350 ml",         price:  6.90, cost:  2.50, sold: 0, category: "Bebidas" },
    { id: 14, name: "Coca-Cola Zero Lata",           price:  6.90, cost:  2.50, sold: 0, category: "Bebidas" },
    { id: 15, name: "Guaraná Antarctica Lata",       price:  6.50, cost:  2.20, sold: 0, category: "Bebidas" },
    { id: 16, name: "Água Mineral 500 ml",           price:  3.50, cost:  1.00, sold: 0, category: "Bebidas" },
    { id: 17, name: "Combo XVII Individual",         price: 45.90, cost: 18.60, sold: 0, category: "Combos"  },
    { id: 18, name: "Combo Crocante",                price: 64.90, cost: 26.80, sold: 0, category: "Combos"  },
    { id: 19, name: "Combo Casal",                   price: 99.90, cost: 40.70, sold: 0, category: "Combos"  },
    { id: 20, name: "Combo Inverno",                 price: 79.90, cost: 32.20, sold: 0, category: "Combos"  }
  ],
  clients: [],
  stock: [],
  orders: [],
  finance: [],
  week: [],
  campaigns: []
};

const storeKey = "distrito-os-v5";
const AUTH_KEY = "distrito-os-auth";

function checkAuth() {
  return localStorage.getItem(AUTH_KEY) === "ok";
}

function login(user, pass) {
  if (user === "admin" && pass === "distrito17") {
    localStorage.setItem(AUTH_KEY, "ok");
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  document.querySelector(".app-shell").hidden = true;
  document.getElementById("loginScreen").hidden = false;
}

const recipes = {
  1: {
    portion: "500 g",
    ingredients: [
      { name: "Batata palito (crua)",   qty: "350 g" },
      { name: "Óleo de soja (fritura)", qty: "60 ml"  },
      { name: "Sal refinado",           qty: "6 g"    },
      { name: "Páprica defumada",       qty: "2 g"    },
      { name: "Orégano seco",           qty: "1 g"    },
      { name: "Caixa kraft 500 ml",     qty: "1 un"   },
      { name: "Guardanapo descartável", qty: "2 un"   },
      { name: "Adesivo Distrito XVII",  qty: "1 un"   },
    ],
    method: [
      "Corte as batatas em palito de 0,8 cm. Deixe de molho em água fria por 15 min.",
      "Seque bem com papel toalha — batata úmida não fica crocante.",
      "Frite em óleo a 175 °C por 6–8 min até dourar por igual.",
      "Escorra. Tempere com sal, páprica e orégano ainda quente.",
      "Embale na caixa kraft. Lacre com o adesivo.",
    ]
  },
  2: {
    portion: "500 g",
    ingredients: [
      { name: "Batata palito (crua)",   qty: "350 g" },
      { name: "Óleo de soja (fritura)", qty: "60 ml"  },
      { name: "Cheddar cremoso",        qty: "80 g"   },
      { name: "Bacon fatiado",          qty: "80 g"   },
      { name: "Sal refinado",           qty: "4 g"    },
      { name: "Páprica defumada",       qty: "2 g"    },
      { name: "Caixa kraft 500 ml",     qty: "1 un"   },
      { name: "Guardanapo descartável", qty: "2 un"   },
      { name: "Adesivo Distrito XVII",  qty: "1 un"   },
    ],
    method: [
      "Corte o bacon em cubinhos e grelhe em frigideira seca até crocante. Reserve.",
      "Prepare a batata conforme a Ficha da Batata Clássica.",
      "Aqueça o cheddar em banho-maria até cremoso e homogêneo.",
      "Monte: batata frita → regue com cheddar → finalize com bacon crocante.",
      "Embale na caixa kraft. Lacre com o adesivo.",
    ]
  },
  3: {
    portion: "700 g",
    ingredients: [
      { name: "Batata palito (crua)",   qty: "450 g" },
      { name: "Óleo de soja (fritura)", qty: "80 ml"  },
      { name: "Cheddar cremoso",        qty: "80 g"   },
      { name: "Bacon fatiado",          qty: "80 g"   },
      { name: "Calabresa fatiada",      qty: "60 g"   },
      { name: "Cebola",                 qty: "40 g"   },
      { name: "Cebolinha fresca",       qty: "10 g"   },
      { name: "Sal e pimenta",          qty: "a gosto"},
      { name: "Óleo para refogar",      qty: "10 ml"  },
      { name: "Caixa kraft 700 ml",     qty: "1 un"   },
      { name: "Guardanapo descartável", qty: "2 un"   },
      { name: "Adesivo Distrito XVII",  qty: "1 un"   },
    ],
    method: [
      "Grelhe o bacon até crocante. Reserve.",
      "Refogue a calabresa fatiada com a cebola em óleo até caramelizar. Reserve.",
      "Prepare a batata conforme a Ficha da Batata Clássica.",
      "Aqueça o cheddar em banho-maria até cremoso.",
      "Monte em camadas: batata → cheddar → bacon → calabresa acebolada → cebolinha picada.",
      "Embale na caixa kraft 700 ml. Lacre com o adesivo.",
    ]
  },
  4: {
    portion: "400 g + molho",
    ingredients: [
      { name: "Peito de frango",        qty: "300 g"  },
      { name: "Farinha panko",          qty: "60 g"   },
      { name: "Farinha de trigo",       qty: "50 g"   },
      { name: "Ovo",                    qty: "1 un"   },
      { name: "Leite",                  qty: "30 ml"  },
      { name: "Alho em pó",            qty: "3 g"    },
      { name: "Sal refinado",           qty: "5 g"    },
      { name: "Páprica defumada",       qty: "3 g"    },
      { name: "Óleo de soja (fritura)", qty: "100 ml" },
      { name: "Molho da casa (sachê)",  qty: "30 g"   },
      { name: "Embalagem",             qty: "1 un"   },
      { name: "Guardanapo descartável", qty: "2 un"   },
      { name: "Adesivo Distrito XVII",  qty: "1 un"   },
    ],
    method: [
      "Corte o frango em cubos de 3–4 cm. Tempere com sal, alho e páprica. Deixe 20 min.",
      "Passe cada cubo na farinha de trigo → ovo batido com leite → panko.",
      "Pressione bem o panko para aderir.",
      "Frite em óleo a 180 °C por 5–6 min até dourar. Não encher a fritadeira.",
      "Escorra em papel toalha.",
      "Embale com o molho da casa em sachê separado.",
    ]
  },
  5: {
    portion: "400 g + molho",
    ingredients: [
      { name: "Peito de frango",        qty: "300 g"  },
      { name: "Farinha temperada",      qty: "60 g"   },
      { name: "Alho em pó",            qty: "3 g"    },
      { name: "Limão (suco)",           qty: "15 ml"  },
      { name: "Sal refinado",           qty: "5 g"    },
      { name: "Óleo de soja (fritura)", qty: "80 ml"  },
      { name: "Molho especial (sachê)", qty: "40 g"   },
      { name: "Embalagem",             qty: "1 un"   },
      { name: "Guardanapo descartável", qty: "2 un"   },
      { name: "Adesivo Distrito XVII",  qty: "1 un"   },
    ],
    method: [
      "Corte o frango em tiras de 1 cm × 5 cm (iscas).",
      "Tempere com sal, alho e suco de limão. Deixe marinar 20 min na geladeira.",
      "Passe as iscas na farinha temperada. Sacuda o excesso.",
      "Frite em óleo a 180 °C por 4–5 min até dourar e crocante.",
      "Escorra em papel toalha. Embale com molho especial em sachê separado.",
    ]
  },
  6: {
    portion: "400 g",
    ingredients: [
      { name: "Calabresa fatiada",      qty: "350 g"  },
      { name: "Cebola",                 qty: "100 g"  },
      { name: "Óleo de soja",           qty: "20 ml"  },
      { name: "Sal e pimenta-do-reino", qty: "a gosto"},
      { name: "Embalagem",             qty: "1 un"   },
      { name: "Guardanapo descartável", qty: "2 un"   },
      { name: "Adesivo Distrito XVII",  qty: "1 un"   },
    ],
    method: [
      "Fatie a calabresa em rodelas de 0,5 cm.",
      "Grelhe na chapa bem quente sem óleo até marcar dos dois lados.",
      "Na mesma chapa, refogue a cebola fatiada em óleo até caramelizar (dourada).",
      "Misture calabresa e cebola. Ajuste sal e pimenta.",
      "Embale. Sirva imediatamente — cai temperatura rápido.",
    ]
  },
  7: {
    portion: "350 g",
    ingredients: [
      { name: "Toucinho com pele",      qty: "500 g"  },
      { name: "Sal grosso",             qty: "10 g"   },
      { name: "Alho em pó",            qty: "5 g"    },
      { name: "Óleo de soja (fritura)", qty: "200 ml" },
      { name: "Embalagem",             qty: "1 un"   },
      { name: "Guardanapo descartável", qty: "2 un"   },
      { name: "Adesivo Distrito XVII",  qty: "1 un"   },
    ],
    method: [
      "Corte o toucinho em cubos de 4 cm com a pele.",
      "Cozinhe em água com sal grosso por 20 min. Escorra e seque muito bem.",
      "Tempere com sal grosso e alho. Deixe secar mais 10 min.",
      "Frite em óleo quente a 190 °C por 8–10 min até pururucar e dourar.",
      "Retire, escorra em papel toalha. Embale imediatamente — perde crocância rápido.",
    ]
  },
  8: {
    portion: "500 ml",
    ingredients: [
      { name: "Batata",                 qty: "200 g"  },
      { name: "Couve manteiga",         qty: "60 g"   },
      { name: "Linguiça calabresa",     qty: "80 g"   },
      { name: "Caldo de legumes",       qty: "400 ml" },
      { name: "Alho",                   qty: "2 dentes"},
      { name: "Azeite de oliva",        qty: "15 ml"  },
      { name: "Sal e pimenta",          qty: "a gosto"},
      { name: "Pote com tampa 500 ml",  qty: "1 un"   },
      { name: "Colher descartável",     qty: "1 un"   },
      { name: "Guardanapo + adesivo",   qty: "1 kit"  },
    ],
    method: [
      "Refogue o alho no azeite. Adicione a batata picada e o caldo. Cozinhe 20 min.",
      "Bata no liquidificador até liso e cremoso. Volte ao fogo.",
      "Adicione a linguiça fatiada. Cozinhe mais 5 min.",
      "Corte a couve em chiffonade bem fina. Adicione nos últimos 2 min.",
      "Ajuste o sal. Finalize com fio de azeite.",
      "Transfira para o pote. Feche a tampa. Sirva quente.",
    ]
  },
  9: {
    portion: "500 ml",
    ingredients: [
      { name: "Aipim (mandioca)",       qty: "250 g"  },
      { name: "Carne seca desfiada",    qty: "100 g"  },
      { name: "Caldo de carne",         qty: "400 ml" },
      { name: "Cebola",                 qty: "40 g"   },
      { name: "Alho",                   qty: "2 dentes"},
      { name: "Azeite de oliva",        qty: "15 ml"  },
      { name: "Sal",                    qty: "a gosto"},
      { name: "Pote com tampa 500 ml",  qty: "1 un"   },
      { name: "Colher descartável",     qty: "1 un"   },
      { name: "Guardanapo + adesivo",   qty: "1 kit"  },
    ],
    method: [
      "Dessalgue a carne seca: deixe de molho 12 h trocando a água 2–3 vezes. Cozinhe e desfie.",
      "Cozinhe o aipim em caldo de carne até bem macio. Bata no liquidificador até cremoso.",
      "Refogue cebola e alho no azeite até dourar.",
      "Adicione o creme de aipim à panela. Misture bem.",
      "Junte a carne seca desfiada. Cozinhe mais 5 min. Ajuste o sal.",
      "Transfira para o pote. Feche a tampa. Sirva quente.",
    ]
  },
  17: {
    portion: "1 porção",
    ingredients: [
      { name: "Batata Cheddar & Bacon (pronta)", qty: "1 cx (500 g)" },
      { name: "Coca-Cola Lata 350 ml",           qty: "1 un"         },
    ],
    method: [
      "Prepare a Batata Cheddar & Bacon conforme sua ficha técnica.",
      "Embale a lata de Coca-Cola junto ou em saquinho separado.",
      "Confira os itens antes de fechar o pedido.",
    ]
  },
  18: {
    portion: "1 porção",
    ingredients: [
      { name: "Frango Crocante (pronto)",    qty: "1 cx (400 g)" },
      { name: "Batata Clássica (pronta)",    qty: "1 cx (500 g)" },
      { name: "Molho (2 sachês à escolha)",  qty: "2 un"         },
    ],
    method: [
      "Prepare o Frango Crocante conforme sua ficha técnica.",
      "Prepare a Batata Clássica conforme sua ficha técnica.",
      "Inclua 2 molhos à escolha do cliente.",
      "Confira os itens antes de fechar o pedido.",
    ]
  },
  19: {
    portion: "2 porções",
    ingredients: [
      { name: "Batata XVII Suprema (pronta)", qty: "1 cx (700 g)" },
      { name: "Frango Crocante (pronto)",     qty: "1 cx (400 g)" },
      { name: "Refrigerante lata 350 ml",     qty: "2 un"         },
    ],
    method: [
      "Prepare a Batata XVII Suprema conforme sua ficha técnica.",
      "Prepare o Frango Crocante conforme sua ficha técnica.",
      "Inclua 2 latas de refrigerante (conforme pedido do cliente).",
      "Confira os itens antes de fechar o pedido.",
    ]
  },
  20: {
    portion: "2 porções",
    ingredients: [
      { name: "Caldo Verde (pronto)",                qty: "1 pote (500 ml)" },
      { name: "Caldo de Aipim com Carne Seca (pronto)", qty: "1 pote (500 ml)" },
      { name: "Torresmo Crocante (pronto)",          qty: "1 cx (350 g)"    },
    ],
    method: [
      "Prepare ambos os caldos conforme suas fichas técnicas.",
      "Prepare o Torresmo Crocante conforme sua ficha técnica.",
      "Obs.: caldos e torresmo devem sair juntos — coordene os tempos.",
      "Confira os itens antes de fechar o pedido.",
    ]
  },
};

let state = loadState();

const viewTitles = {
  dashboard: "Dashboard",
  pedidos: "Pedidos",
  clientes: "Clientes",
  produtos: "Produtos",
  estoque: "Estoque",
  financeiro: "Financeiro",
  relatorios: "Relatórios",
  marketing: "Marketing",
  ia: "IA operacional",
  config: "Configurações"
};

const statusClass = {
  "Aguardando pagamento": "muted",
  "Em produção": "",
  "Saiu para entrega": "blue",
  "Pedido finalizado": "green",
  VIP: "",
  Frequente: "green",
  Novo: "blue",
  Entrada: "green",
  Saída: "red"
};

const channelClass = {
  WhatsApp: "green",
  iFood: "red",
  "99Food": "blue",
  Instagram: "blue",
  Presencial: "muted"
};

function loadState() {
  const saved = localStorage.getItem(storeKey);
  if (!saved) return structuredClone(seedData);
  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(seedData);
  }
}

function saveState() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function currency(value) {
  return BRL.format(value);
}

function today() {
  return new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function todayRevenue() {
  return state.finance
    .filter((item) => item.type === "Entrada" && item.date === today())
    .reduce((sum, item) => sum + item.value, 0);
}

function monthRevenue() {
  return state.finance
    .filter((item) => item.type === "Entrada")
    .reduce((sum, item) => sum + item.value, 0);
}

function monthlyCosts() {
  return Math.abs(state.finance
    .filter((item) => item.type === "Saída")
    .reduce((sum, item) => sum + item.value, 0));
}

function cmvAverage() {
  const totalSales = state.products.reduce((sum, item) => sum + item.price * item.sold, 0);
  const totalCosts = state.products.reduce((sum, item) => sum + item.cost * item.sold, 0);
  if (totalSales === 0) return 0;
  return Math.round((totalCosts / totalSales) * 100);
}

function render() {
  renderMetrics();
  renderChart();
  renderProducts();
  renderStock();
  renderOrders();
  renderClients();
  renderFinance();
  renderReports();
  renderMarketing();
}

function renderFichas() {
  const commission = (state.settings.ifoodCommission || 23) / 100;
  const items = state.products.filter((p) => recipes[p.id]);

  document.getElementById("fichasGrid").innerHTML = items.map((product) => {
    const rec = recipes[product.id];
    const wppProfit = product.price - product.cost;
    const ifoodProfit = product.price * (1 - commission) - product.cost;
    return `
      <article class="ficha-card">
        <header class="ficha-header">
          <div>
            <p class="ficha-eyebrow">${product.category}</p>
            <h2 class="ficha-name">${product.name}</h2>
            <p class="ficha-portion">Rendimento: <strong>${rec.portion}</strong></p>
          </div>
          <div class="ficha-brand">
            <img src="assets/distrito-xvii-logo.jpeg" alt="Distrito XVII" />
          </div>
        </header>

        <div class="ficha-body">
          <section class="ficha-section">
            <h3>Ingredientes</h3>
            <table class="ficha-table">
              <thead><tr><th>Ingrediente</th><th>Qtd.</th></tr></thead>
              <tbody>
                ${rec.ingredients.map((ing) => `
                  <tr><td>${ing.name}</td><td>${ing.qty}</td></tr>
                `).join("")}
              </tbody>
            </table>
          </section>

          <section class="ficha-section">
            <h3>Modo de Preparo</h3>
            <ol class="ficha-steps">
              ${rec.method.map((step) => `<li>${step}</li>`).join("")}
            </ol>
          </section>
        </div>

        <footer class="ficha-footer">
          <span>Custo: <strong>${currency(product.cost)}</strong></span>
          <span>Preço: <strong>${currency(product.price)}</strong></span>
          <span>Lucro WPP: <strong>${currency(wppProfit)}</strong></span>
          <span>Lucro iFood: <strong>${currency(ifoodProfit)}</strong></span>
        </footer>
      </article>
    `;
  }).join("");
}

function renderMetrics() {
  const revenue = todayRevenue();
  document.getElementById("heroRevenue").textContent = currency(revenue);
  document.getElementById("heroDelta").textContent = `${Math.round((revenue / state.settings.dailyGoal) * 100)}% da meta diária`;

  const metrics = [
    { label: "Faturamento hoje", value: currency(revenue), delta: "+12% vs. ontem", trend: "up" },
    { label: "Pedidos hoje", value: state.orders.length, delta: "18 min tempo médio", trend: "up" },
    { label: "Lucro estimado", value: currency(revenue - revenue * (cmvAverage() / 100)), delta: `${cmvAverage()}% CMV`, trend: "up" },
    { label: "Ticket médio", value: currency(revenue / Math.max(state.orders.length, 1)), delta: "+R$ 4,20 na semana", trend: "up" },
    { label: "Nota operacional", value: "4,9", delta: "zero cancelamentos", trend: "up" }
  ];

  document.getElementById("metricGrid").innerHTML = metrics.map((item) => `
    <article class="metric-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small class="${item.trend}">${item.delta}</small>
    </article>
  `).join("");

  const financeMetrics = [
    { label: "Entradas do mês", value: currency(monthRevenue()), delta: "inclui WhatsApp e iFood" },
    { label: "Saídas do mês", value: currency(monthlyCosts()), delta: "insumos e operação" },
    { label: "Lucro parcial", value: currency(monthRevenue() - monthlyCosts()), delta: "antes de impostos" },
    { label: "CMV médio", value: `${cmvAverage()}%`, delta: `meta: ${state.settings.cmvGoal}%` }
  ];

  document.getElementById("financeMetrics").innerHTML = financeMetrics.map((item) => `
    <article class="metric-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.delta}</small>
    </article>
  `).join("");
}

function renderChart() {
  const mode = document.getElementById("chartMode").value;
  if (!state.week.length) {
    document.getElementById("salesChart").innerHTML = `<div class="empty-hint">Nenhum dado de vendas ainda.</div>`;
    return;
  }
  const max = Math.max(...state.week.map((item) => item[mode]));
  document.getElementById("salesChart").innerHTML = state.week.map((item) => {
    const value = item[mode];
    const height = Math.max(18, Math.round((value / max) * 220));
    const label = mode === "revenue" ? currency(value).replace(",00", "") : value;
    return `<div class="bar" style="height:${height}px"><strong>${label}</strong><span>${item.day}</span></div>`;
  }).join("");
}

function renderProducts() {
  const sorted = [...state.products].sort((a, b) => b.sold - a.sold);
  document.getElementById("topProducts").innerHTML = sorted.slice(0, 5).map((item, index) => `
    <div class="rank-item">
      <span>${index + 1}. ${item.name}</span>
      <strong>${item.sold}</strong>
    </div>
  `).join("");

  const commission = (state.settings.ifoodCommission || 23) / 100;
  document.getElementById("productGrid").innerHTML = state.products.map((item) => {
    if (item.cost === 0) {
      return `
        <article class="product-card">
          <span>${item.category}</span>
          <strong>${item.name}</strong>
          <div>Preço: ${currency(item.price)}</div>
          <div>Custo: — preencher</div>
          <span class="pill muted">Custo pendente</span>
        </article>
      `;
    }
    const wppProfit = item.price - item.cost;
    const wppMargin = Math.round((wppProfit / item.price) * 100);
    const netAfterIfood = item.price * (1 - commission);
    const ifoodProfit = netAfterIfood - item.cost;
    return `
      <article class="product-card">
        <span>${item.category}</span>
        <strong>${item.name}</strong>
        <div>Preço: ${currency(item.price)} · Custo: ${currency(item.cost)}</div>
        <div class="product-margins">
          <span class="pill ${wppMargin >= 40 ? "green" : "red"}">WPP ${currency(wppProfit)}</span>
          <span class="pill ${ifoodProfit >= 8 ? "green" : "red"}">iFood ${currency(ifoodProfit)}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderStock() {
  const alerts = state.stock.filter((item) => item.quantity <= item.min);
  const alertsEl = document.getElementById("stockAlerts");
  alertsEl.innerHTML = alerts.length
    ? alerts.map((item) => `
      <div class="alert-item">
        <span>${item.item}</span>
        <strong class="pill red">${item.quantity} ${item.unit}</strong>
      </div>
    `).join("")
    : `<div class="alert-item"><span>Nenhum item crítico</span><strong class="pill green">OK</strong></div>`;

  document.getElementById("stockGrid").innerHTML = state.stock.map((item) => {
    const percent = Math.min(100, Math.round((item.quantity / item.capacity) * 100));
    const risk = item.quantity <= item.min ? "danger" : percent < 45 ? "warning" : "";
    return `
      <article class="stock-card">
        <span>${item.unit} em estoque</span>
        <strong>${item.item}</strong>
        <div>${item.quantity} ${item.unit} disponíveis</div>
        <div class="progress ${risk}" style="--value:${percent}%"><i></i></div>
        <small>Mínimo recomendado: ${item.min} ${item.unit}</small>
      </article>
    `;
  }).join("");
}

function renderOrders() {
  document.getElementById("recentOrders").innerHTML = state.orders.slice(0, 5).map((item) => `
    <tr>
      <td>#${item.id}</td>
      <td>${item.client}</td>
      <td>${item.product}</td>
      <td><span class="pill ${channelClass[item.channel] || ""}">${item.channel}</span></td>
      <td><span class="pill ${statusClass[item.status] || ""}">${item.status}</span></td>
      <td>${currency(item.total)}</td>
    </tr>
  `).join("");

  const columns = ["Aguardando pagamento", "Em produção", "Saiu para entrega", "Pedido finalizado"];
  document.getElementById("orderBoard").innerHTML = columns.map((status) => {
    const orders = state.orders.filter((item) => item.status === status);
    return `
      <section class="kanban-column">
        <h4>${status}</h4>
        ${orders.map((item) => `
          <article class="order-card">
            <strong>#${item.id} - ${item.client}</strong>
            <span>${item.product}</span>
            <footer><span>${item.channel}</span><span>${currency(item.total)}</span></footer>
          </article>
        `).join("") || `<small>Sem pedidos nesta etapa</small>`}
      </section>
    `;
  }).join("");
}

function renderClients(filter = "all") {
  const clients = filter === "all" ? state.clients : state.clients.filter((item) => item.status === filter);
  document.getElementById("clientsTable").innerHTML = clients.map((item) => `
    <tr>
      <td>${item.name}<br><small>${item.last}</small></td>
      <td>${item.phone}</td>
      <td>${item.orders}</td>
      <td>${currency(item.average)}</td>
      <td>${currency(item.total)}</td>
      <td><span class="pill ${statusClass[item.status] || ""}">${item.status}</span></td>
    </tr>
  `).join("");
}

function renderFinance() {
  document.getElementById("financeTable").innerHTML = state.finance.map((item) => `
    <tr>
      <td>${item.date}</td>
      <td>${item.description}</td>
      <td>${item.category}</td>
      <td><span class="pill ${statusClass[item.type]}">${item.type}</span></td>
      <td>${currency(item.value)}</td>
    </tr>
  `).join("");

  const revenue = monthRevenue();
  const costs = monthlyCosts();
  const dre = [
    ["Receita bruta", revenue],
    ["Custos e despesas", -costs],
    ["Resultado parcial", revenue - costs],
    ["Margem líquida", revenue > 0 ? `${Math.round(((revenue - costs) / revenue) * 100)}%` : "—"]
  ];
  document.getElementById("dreList").innerHTML = dre.map(([label, value]) => `
    <div class="dre-item">
      <span>${label}</span>
      <strong>${typeof value === "number" ? currency(value) : value}</strong>
    </div>
  `).join("");
}

function renderReports() {
  const topClient = [...state.clients].sort((a, b) => b.total - a.total)[0];
  const topProduct = [...state.products].sort((a, b) => b.sold - a.sold)[0];
  const lowStock = state.stock.filter((item) => item.quantity <= item.min).length;

  if (!topClient && !topProduct) {
    document.getElementById("reportsGrid").innerHTML = `<div class="empty-hint">Cadastre produtos e clientes para ver os relatórios.</div>`;
    return;
  }

  const reports = [
    topClient && { title: "Melhor cliente", value: topClient.name, detail: `${currency(topClient.total)} acumulados` },
    topProduct && { title: "Produto líder", value: topProduct.name, detail: `${topProduct.sold} vendas no período` },
    { title: "Estoque crítico", value: `${lowStock} item(ns)`, detail: "priorizar próxima compra" }
  ].filter(Boolean);

  document.getElementById("reportsGrid").innerHTML = reports.map((item) => `
    <article class="report-card">
      <span>${item.title}</span>
      <strong>${item.value}</strong>
      <small>${item.detail}</small>
    </article>
  `).join("");
}

function renderMarketing() {
  const campaigns = state.campaigns || [];
  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const conversion = totalReach > 0 ? ((totalLeads / totalReach) * 100).toFixed(1) : "0.0";

  const metrics = [
    { label: "Alcance total", value: totalReach.toLocaleString("pt-BR"), delta: "todas as campanhas" },
    { label: "Leads gerados", value: totalLeads, delta: "contatos qualificados" },
    { label: "Taxa de conversão", value: `${conversion}%`, delta: "leads / alcance" },
    { label: "Investimento", value: currency(totalBudget), delta: "campanhas pagas" }
  ];

  document.getElementById("marketingMetrics").innerHTML = metrics.map((item) => `
    <article class="metric-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.delta}</small>
    </article>
  `).join("");

  const campaignStatusClass = { Ativo: "green", Encerrado: "muted", Pausado: "" };

  document.getElementById("campaignsTable").innerHTML = campaigns.map((item) => {
    const conv = item.reach > 0 ? ((item.leads / item.reach) * 100).toFixed(1) : "0.0";
    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.channel}</td>
        <td><span class="pill ${campaignStatusClass[item.status] || ""}">${item.status}</span></td>
        <td>${item.reach.toLocaleString("pt-BR")}</td>
        <td>${item.leads}</td>
        <td>${conv}%</td>
        <td>${item.budget > 0 ? currency(item.budget) : "—"}</td>
      </tr>
    `;
  }).join("");

  const channelMap = {};
  campaigns.forEach((c) => {
    if (!channelMap[c.channel]) channelMap[c.channel] = { leads: 0, reach: 0 };
    channelMap[c.channel].leads += c.leads;
    channelMap[c.channel].reach += c.reach;
  });
  const channels = Object.entries(channelMap).sort((a, b) => b[1].leads - a[1].leads);

  document.getElementById("channelRank").innerHTML = channels.map(([channel, data]) => `
    <div class="rank-item">
      <span>${channel}</span>
      <strong>${data.leads} leads</strong>
    </div>
  `).join("");
}

function askAssistant(prompt) {
  const question = prompt.toLowerCase();
  let answer = "Ainda estou na versão demonstrativa. Posso responder sobre vendas, estoque, clientes VIP e produtos mais vendidos.";

  if (question.includes("vendi") || question.includes("fatur")) {
    answer = `Hoje o faturamento registrado é ${currency(todayRevenue())}, com ${state.orders.length} pedidos no painel.`;
  } else if (question.includes("bacon")) {
    const bacon = state.stock.find((item) => item.item.toLowerCase() === "bacon");
    answer = bacon
      ? `Você tem ${bacon.quantity} ${bacon.unit} de bacon. O mínimo configurado é ${bacon.min} ${bacon.unit}.`
      : "Bacon não encontrado no estoque.";
  } else if (question.includes("vip") || question.includes("cliente")) {
    const client = [...state.clients].sort((a, b) => b.total - a.total)[0];
    answer = client
      ? `${client.name} é o cliente de maior valor, com ${client.orders} pedidos e ${currency(client.total)} gastos.`
      : "Nenhum cliente cadastrado ainda.";
  } else if (question.includes("produto") || question.includes("vende")) {
    const product = [...state.products].sort((a, b) => b.sold - a.sold)[0];
    answer = product
      ? `${product.name} lidera o período, com ${product.sold} vendas.`
      : "Nenhum produto cadastrado ainda.";
  } else if (question.includes("lucro")) {
    answer = `O lucro parcial estimado é ${currency(monthRevenue() - monthlyCosts())}, antes de impostos e taxas adicionais.`;
  }

  addMessage(prompt, "user");
  addMessage(answer, "assistant");
}

function addMessage(text, who) {
  const log = document.getElementById("assistantLog");
  const message = document.createElement("div");
  message.className = `message ${who === "user" ? "user" : ""}`;
  message.textContent = text;
  log.appendChild(message);
  log.scrollTop = log.scrollHeight;
}

function openModal(type) {
  const backdrop = document.getElementById("modalBackdrop");
  const form = document.getElementById("modalForm");
  const title = document.getElementById("modalTitle");

  const templates = {
    "new-order": {
      title: "Novo pedido",
      fields: [
        ["client", "Cliente", "text"],
        ["productId", "Produto", "select-products"],
        ["qty", "Quantidade", "number"],
        ["channel", "Canal", "select", ["WhatsApp", "iFood", "99Food", "Instagram", "Presencial"]],
        ["total", "Total (R$)", "number"]
      ],
      submit: "Adicionar pedido"
    },
    "new-product": {
      title: "Novo produto",
      fields: [
        ["name", "Nome", "text"],
        ["price", "Preço", "number"],
        ["cost", "Custo", "number"],
        ["category", "Categoria", "text"]
      ],
      submit: "Adicionar produto"
    },
    "new-stock": {
      title: "Registrar compra",
      fields: [
        ["item", "Item", "text"],
        ["quantity", "Quantidade", "number"],
        ["unit", "Unidade", "text"],
        ["cost", "Custo unitário", "number"]
      ],
      submit: "Registrar"
    },
    "new-campaign": {
      title: "Nova campanha",
      fields: [
        ["name", "Nome da campanha", "text"],
        ["channel", "Canal", "select", ["Instagram", "WhatsApp", "Meta Ads", "iFood", "99Food", "TikTok"]],
        ["reach", "Alcance estimado", "number"],
        ["budget", "Investimento (R$)", "number"]
      ],
      submit: "Criar campanha"
    }
  };

  const config = templates[type];
  title.textContent = config.title;
  form.dataset.type = type;
  form.innerHTML = config.fields.map(([id, label, inputType, options]) => {
    if (inputType === "select") {
      return `<label>${label}<select name="${id}" required>${options.map((o) => `<option value="${o}">${o}</option>`).join("")}</select></label>`;
    }
    if (inputType === "select-products") {
      const opts = state.products.map((p) => `<option value="${p.id}" data-price="${p.price}">${p.name} — ${currency(p.price)}</option>`).join("");
      return `<label>${label}<select name="${id}" id="modalProductSel" required><option value="">Selecione o produto...</option>${opts}</select></label>`;
    }
    const defaults = { qty: "1" };
    return `<label>${label}<input name="${id}" type="${inputType}" step="0.01" value="${defaults[id] || ""}" required></label>`;
  }).join("") + `<button class="primary-button" type="submit">${config.submit}</button>`;

  // Auto-fill total when product or qty changes
  const prodSel = form.querySelector("#modalProductSel");
  const totalInput = form.querySelector('[name="total"]');
  const qtyInput = form.querySelector('[name="qty"]');
  if (prodSel && totalInput) {
    function updateTotal() {
      const opt = prodSel.selectedOptions[0];
      if (!opt || !opt.dataset.price) return;
      const qty = Number(qtyInput?.value) || 1;
      totalInput.value = (Number(opt.dataset.price) * qty).toFixed(2);
    }
    prodSel.addEventListener("change", updateTotal);
    if (qtyInput) qtyInput.addEventListener("input", updateTotal);
  }

  backdrop.hidden = false;
  (form.querySelector("input") || form.querySelector("select")).focus();
}

function closeModal() {
  document.getElementById("modalBackdrop").hidden = true;
}

function handleModalSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const type = form.dataset.type;

  if (type === "new-order") {
    const nextId = String(Number(state.orders[0]?.id || "0") + 1).padStart(4, "0");
    const product = state.products.find((p) => String(p.id) === String(data.productId));
    const qty = Math.max(1, Number(data.qty) || 1);
    const total = Number(data.total);

    state.orders.unshift({
      id: nextId,
      client: data.client,
      product: product ? product.name : data.productId,
      status: "Aguardando pagamento",
      total,
      channel: data.channel,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    });

    // Receita
    state.finance.unshift({
      date: today(),
      description: `Pedido #${nextId} · ${product ? product.name : ""}`,
      category: "Vendas",
      type: "Entrada",
      value: total
    });

    // ERP: incrementa vendas e registra CMV
    if (product) {
      product.sold = (product.sold || 0) + qty;
      const cmvValue = product.cost * qty;
      if (cmvValue > 0) {
        state.finance.unshift({
          date: today(),
          description: `CMV · ${product.name} (x${qty})`,
          category: "CMV",
          type: "Saída",
          value: -cmvValue
        });
      }
    }
  }

  if (type === "new-product") {
    state.products.push({
      id: Date.now(),
      name: data.name,
      price: Number(data.price),
      cost: Number(data.cost),
      sold: 0,
      category: data.category
    });
  }

  if (type === "new-campaign") {
    if (!state.campaigns) state.campaigns = [];
    state.campaigns.unshift({
      name: data.name,
      channel: data.channel,
      status: "Ativo",
      reach: Number(data.reach),
      leads: 0,
      budget: Number(data.budget)
    });
  }

  if (type === "new-stock") {
    const existing = state.stock.find((item) => item.item.toLowerCase() === data.item.toLowerCase());
    if (existing) {
      existing.quantity += Number(data.quantity);
      existing.cost = Number(data.cost);
    } else {
      state.stock.push({ item: data.item, unit: data.unit, quantity: Number(data.quantity), min: 1, capacity: Number(data.quantity) * 2, cost: Number(data.cost) });
    }
    state.finance.unshift({ date: today(), description: `Compra de ${data.item}`, category: "Insumos", type: "Saída", value: -(Number(data.quantity) * Number(data.cost)) });
  }

  saveState();
  render();
  closeModal();
}

function wireEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll(".view").forEach((item) => item.classList.toggle("active", item.id === view));
      document.getElementById("viewTitle").textContent = viewTitles[view];
      document.querySelector(".sidebar").classList.remove("open");
    });
  });

  document.getElementById("menuToggle").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("open");
  });

  document.getElementById("chartMode").addEventListener("change", renderChart);

  document.querySelectorAll("#prodToggle .segment").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#prodToggle .segment").forEach((s) => s.classList.toggle("active", s === btn));
      const isFichas = btn.dataset.prodView === "fichas";
      document.getElementById("productGrid").hidden = isFichas;
      document.getElementById("fichasGrid").hidden = !isFichas;
      document.getElementById("printFichas").hidden = !isFichas;
      if (isFichas) renderFichas();
    });
  });

  document.getElementById("printFichas").addEventListener("click", () => window.print());

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.action));
  });

  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", (event) => {
    if (event.target.id === "modalBackdrop") closeModal();
  });
  document.getElementById("modalForm").addEventListener("submit", handleModalSubmit);

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".segment").forEach((item) => item.classList.toggle("active", item === button));
      renderClients(button.dataset.filter);
    });
  });

  document.getElementById("assistantForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("assistantInput");
    if (!input.value.trim()) return;
    askAssistant(input.value.trim());
    input.value = "";
  });

  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => askAssistant(button.dataset.prompt));
  });

  document.getElementById("seedButton").addEventListener("click", () => {
    state = structuredClone(seedData);
    saveState();
    render();
    addMessage("Dados de exemplo recarregados.", "assistant");
  });

  document.getElementById("saveConfig").addEventListener("click", () => {
    state.settings.businessName = document.getElementById("businessName").value;
    state.settings.dailyGoal = Number(document.getElementById("dailyGoal").value);
    state.settings.cmvGoal = Number(document.getElementById("cmvGoal").value);
    state.settings.ifoodCommission = Number(document.getElementById("ifoodCommission").value);
    state.settings.stockAlerts = document.getElementById("stockAlertsToggle").checked;
    saveState();
    render();
  });

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      if (login(fd.get("user"), fd.get("pass"))) {
        document.getElementById("loginScreen").hidden = true;
        document.querySelector(".app-shell").hidden = false;
        const avatar = document.getElementById("userAvatar");
        if (avatar) avatar.textContent = (fd.get("user") || "A")[0].toUpperCase();
        render();
        addMessage("Bem-vindo ao Distrito OS! Boa operação.", "assistant");
      } else {
        document.getElementById("loginError").hidden = false;
      }
    });
  }

  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  document.getElementById("globalSearch").addEventListener("input", (event) => {
    const term = event.target.value.toLowerCase().trim();
    if (!term) {
      renderClients();
      return;
    }
    const clients = state.clients.filter((item) => `${item.name} ${item.phone} ${item.status}`.toLowerCase().includes(term));
    document.getElementById("clientsTable").innerHTML = clients.map((item) => `
      <tr>
        <td>${item.name}<br><small>${item.last}</small></td>
        <td>${item.phone}</td>
        <td>${item.orders}</td>
        <td>${currency(item.average)}</td>
        <td>${currency(item.total)}</td>
        <td><span class="pill ${statusClass[item.status] || ""}">${item.status}</span></td>
      </tr>
    `).join("");
  });
}

wireEvents();

if (checkAuth()) {
  document.getElementById("loginScreen").hidden = true;
  document.querySelector(".app-shell").hidden = false;
  render();
  addMessage("Distrito OS pronto. Você já pode perguntar sobre vendas, estoque, clientes ou produtos.", "assistant");
} else {
  document.getElementById("loginScreen").hidden = false;
}

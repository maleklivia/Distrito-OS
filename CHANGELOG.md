# CHANGELOG — Distrito OS

Todas as mudanças significativas são documentadas aqui.
Formato: [Semantic Versioning](https://semver.org/lang/pt-BR/)

---

## [v0.1.0] — 2026-07-09

### Adicionado
- **Estrutura completa do projeto** com separação por responsabilidade (assets, components, css, js, pages, docs)
- **Design system** via `css/variables.css` com tokens de cor, tipografia, espaçamento, sombras e layout
- **CSS modular:** `global.css` (reset + utilitários), `login.css`, `sidebar.css`, `dashboard.css`
- **Identidade visual** Distrito XVII: paleta preto `#111111` + dourado `#C8A24A` + cinza; fontes Bebas Neue e Montserrat
- **Tela de Login** profissional com validação, feedback de erro e redirecionamento automático
- **Sidebar** com 13 seções, ícones SVG e estado ativo dinâmico
- **Header** compartilhado com data e botão de logout
- **Dashboard** com 6 KPI cards calculados em tempo real: Faturamento, Lucro, Pedidos, Ticket Médio, CMV, Estoque Baixo
- **Dashboard** painéis laterais: Pedidos Recentes, Mais Vendidos, Alertas de Estoque
- **12 páginas stub** (Financeiro, Pedidos, Produção, Produtos, Estoque, Compras, Fornecedores, Clientes, Marketing, Documentos, Relatórios, Configurações)
- **`js/storage.js`** — gestão de estado com localStorage, seed data realista e migração de schema
- **`js/utils.js`** — helpers puros: formatação de moeda, datas, IDs, initials, debounce
- **`js/api.js`** — interface de dados unificada (proxy localStorage → preparada para backend)
- **`js/ui.js`** — ComponentLoader via fetch, Toast, Modal, setActiveNav
- **`js/app.js`** — App controller com auto-init via `data-page`, módulos por view
- **Sistema de autenticação** com localStorage; credenciais: `admin` / `distrito17`
- **ERP básico:** criação de pedido registra receita e CMV automaticamente no financeiro
- **`README.md`** com estrutura, como executar e roadmap
- **`MASTERPLAN.md`** com arquitetura, modelo de dados, regras de negócio e roadmap técnico
- **`CHANGELOG.md`** este arquivo

### Arquitetura
- Multi-page HTML com componentes compartilhados via `fetch()`
- `data-page` attribute no `<body>` define o módulo que inicializa a view
- Separação completa: zero CSS inline, zero JS inline (exceto `<script>` de boot na login)
- API layer isolada: quando backend for adicionado, só `api.js` muda

---

## Próximas Versões

### [v0.2.0] — Em planejamento
- Implementação completa de Pedidos (CRUD + status)
- Implementação completa de Produção (kitchen board)
- Implementação completa de Financeiro (extrato + lançamentos)
- Implementação completa de Estoque (edição + histórico)
- Implementação completa de Produtos (cardápio + fichas técnicas)

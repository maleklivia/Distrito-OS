BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT ''
);

CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT ''
);

CREATE TABLE role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  failed_login_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  ip inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX sessions_expires_at_idx ON sessions(expires_at);

CREATE TABLE products (
  id text PRIMARY KEY,
  sku text UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  sale_price numeric(12,2) NOT NULL CHECK (sale_price >= 0),
  purchase_cost numeric(12,4),
  active boolean NOT NULL DEFAULT true,
  preparation_minutes integer NOT NULL DEFAULT 0 CHECK (preparation_minutes >= 0),
  current_stock numeric(14,3),
  minimum_stock numeric(14,3),
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ingredients (
  id text PRIMARY KEY,
  sku text UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  unit text NOT NULL,
  current_stock numeric(14,3) NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  minimum_stock numeric(14,3) NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
  average_daily_use numeric(14,3) NOT NULL DEFAULT 0 CHECK (average_daily_use >= 0),
  lead_time_days integer NOT NULL DEFAULT 0 CHECK (lead_time_days >= 0),
  package_quantity numeric(14,3) NOT NULL DEFAULT 1 CHECK (package_quantity > 0),
  unit_cost numeric(14,6) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  supplier_name text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE technical_sheets (
  id text PRIMARY KEY,
  product_id text NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  yield numeric(12,3) NOT NULL DEFAULT 1 CHECK (yield > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE technical_sheet_items (
  sheet_id text NOT NULL REFERENCES technical_sheets(id) ON DELETE CASCADE,
  ingredient_id text NOT NULL REFERENCES ingredients(id),
  quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  PRIMARY KEY (sheet_id, ingredient_id)
);

CREATE TABLE clients (
  id text PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  tax_id text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE client_addresses (
  id text PRIMARY KEY,
  client_id text NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  street text NOT NULL DEFAULT '',
  number text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  complement text NOT NULL DEFAULT ''
);

CREATE TABLE orders (
  id text PRIMARY KEY,
  order_number bigint NOT NULL UNIQUE,
  source text NOT NULL,
  client_id text REFERENCES clients(id),
  client_name text NOT NULL DEFAULT '',
  status text NOT NULL,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(12,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text REFERENCES products(id),
  name text NOT NULL,
  quantity numeric(12,3) NOT NULL CHECK (quantity > 0),
  unit_price numeric(12,2) NOT NULL CHECK (unit_price >= 0),
  subtotal numeric(12,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE TABLE suppliers (
  id text PRIMARY KEY,
  name text NOT NULL,
  tax_id text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  contact_name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  lead_time_days integer NOT NULL DEFAULT 0,
  payment_terms text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE purchases (
  id text PRIMARY KEY,
  purchase_number bigint NOT NULL UNIQUE,
  supplier_id text REFERENCES suppliers(id),
  supplier_name text NOT NULL DEFAULT '',
  status text NOT NULL,
  total numeric(12,2) NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  purchased_at date,
  received_at date,
  invoice_number text NOT NULL DEFAULT '',
  payment_method text NOT NULL DEFAULT '',
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE purchase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id text NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  ingredient_id text REFERENCES ingredients(id),
  name text NOT NULL,
  quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  unit_cost numeric(14,6) NOT NULL DEFAULT 0,
  subtotal numeric(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE stock_movements (
  id text PRIMARY KEY,
  ingredient_id text REFERENCES ingredients(id),
  movement_type text NOT NULL,
  quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  reason text NOT NULL DEFAULT '',
  reference text NOT NULL DEFAULT '',
  movement_date date NOT NULL DEFAULT current_date,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE financial_entries (
  id text PRIMARY KEY,
  entry_date date NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  entry_type text NOT NULL,
  amount numeric(12,2) NOT NULL,
  reference_type text,
  reference_id text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE import_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text NOT NULL UNIQUE,
  imported_by uuid NOT NULL REFERENCES users(id),
  source text NOT NULL DEFAULT 'browser-local-storage',
  payload jsonb NOT NULL,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE legacy_records (
  resource_type text NOT NULL,
  source_id text NOT NULL,
  payload jsonb NOT NULL,
  import_batch_id uuid NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_type, source_id)
);

CREATE TABLE audit_logs (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip inet,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_created_at_idx ON audit_logs(created_at DESC);

INSERT INTO roles (name, description) VALUES
  ('admin', 'Acesso completo'),
  ('gerente', 'Operação, estoque e relatórios'),
  ('atendente', 'Pedidos e clientes'),
  ('producao', 'Fila de produção'),
  ('estoquista', 'Estoque e compras')
ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (code, description) VALUES
  ('users.manage', 'Gerenciar usuários'),
  ('settings.manage', 'Gerenciar configurações'),
  ('catalog.read', 'Consultar catálogo'),
  ('catalog.write', 'Alterar catálogo'),
  ('orders.read', 'Consultar pedidos'),
  ('orders.write', 'Criar e atualizar pedidos'),
  ('clients.read', 'Consultar clientes'),
  ('clients.write', 'Alterar clientes'),
  ('stock.read', 'Consultar estoque'),
  ('stock.write', 'Movimentar estoque'),
  ('purchases.manage', 'Gerenciar compras'),
  ('finance.read', 'Consultar financeiro'),
  ('finance.write', 'Alterar financeiro'),
  ('reports.read', 'Consultar relatórios'),
  ('migration.run', 'Importar dados locais')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code = ANY (ARRAY[
  'catalog.read','catalog.write','orders.read','orders.write','clients.read','clients.write',
  'stock.read','stock.write','purchases.manage','finance.read','finance.write','reports.read'
]) WHERE r.name = 'gerente' ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code = ANY (ARRAY[
  'catalog.read','orders.read','orders.write','clients.read','clients.write'
]) WHERE r.name = 'atendente' ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code = ANY (ARRAY[
  'catalog.read','orders.read','orders.write'
]) WHERE r.name = 'producao' ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code = ANY (ARRAY[
  'catalog.read','stock.read','stock.write','purchases.manage'
]) WHERE r.name = 'estoquista' ON CONFLICT DO NOTHING;

COMMIT;

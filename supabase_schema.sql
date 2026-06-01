-- Execute este SQL no editor do Supabase:
-- Dashboard → SQL Editor → New Query → Cole e execute

-- 1. Criar a tabela de dados financeiros
CREATE TABLE IF NOT EXISTS financeiro_2026 (
  id              SERIAL PRIMARY KEY,
  ano             INTEGER NOT NULL DEFAULT 2026,
  mes             INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  imob_liquido    NUMERIC(12,2) NOT NULL DEFAULT 0,
  despesas        NUMERIC(12,2) NOT NULL DEFAULT 0,
  investimentos   NUMERIC(12,2) NOT NULL DEFAULT 0,
  notas           TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ano, mes)
);

-- 2. Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON financeiro_2026
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. Segurança: qualquer usuário logado pode LER
-- Só o admin pode ESCREVER (controlado pelo app)
ALTER TABLE financeiro_2026 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários logados podem ler"
  ON financeiro_2026 FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários logados podem inserir/atualizar"
  ON financeiro_2026 FOR ALL
  USING (auth.role() = 'authenticated');

-- 4. Inserir dados base de 2026 (planilha atual)
INSERT INTO financeiro_2026 (ano, mes, imob_liquido, despesas, investimentos) VALUES
  (2026,  1, 45943.15, 26060.38,  84000),
  (2026,  2, 49689.00, 20140.09, 120000),
  (2026,  3,     0.00, 26631.78,      0),
  (2026,  4, 19000.00, 24123.84,      0),
  (2026,  5, 13696.00, 26647.14,      0),
  (2026,  6,     0.00, 18980.64,  76962),
  (2026,  7,     0.00, 17378.64,      0),
  (2026,  8,     0.00, 17378.64,      0),
  (2026,  9,     0.00, 17378.64,      0),
  (2026, 10,     0.00, 17378.64,      0),
  (2026, 11,     0.00, 17316.42,      0),
  (2026, 12,     0.00, 18573.64,      0)
ON CONFLICT (ano, mes) DO NOTHING;

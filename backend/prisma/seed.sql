INSERT INTO plans (name, price_cents, max_active_pages) VALUES
  ('free', 0, 0),
  ('basic', 900, 1),
  ('pro', 2900, 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO templates (name, category, component_key) VALUES
  ('Portfolio Minimal', 'portfolio', 'portfolio_minimal')
ON CONFLICT (component_key) DO NOTHING;

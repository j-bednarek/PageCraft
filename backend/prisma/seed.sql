INSERT INTO plans (name, price_cents, max_active_pages) VALUES
  ('free', 0, 0),
  ('basic', 900, 1),
  ('pro', 2900, 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO templates (name, category, component_key, thumbnail_url) VALUES
  ('Portfolio Minimal', 'portfolio', 'portfolio_minimal', '/thumbnails/portfolio_minimal.png'),
  ('Local Business', 'business', 'local_business', '/thumbnails/local_business.png'),
  ('Bistro', 'food', 'bistro', '/thumbnails/bistro.png'),
  ('Event Invite', 'event', 'event_invite', '/thumbnails/event_invite.png'),
  ('Resume', 'resume', 'resume_classic', '/thumbnails/resume_classic.png')
ON CONFLICT (component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  thumbnail_url = EXCLUDED.thumbnail_url;

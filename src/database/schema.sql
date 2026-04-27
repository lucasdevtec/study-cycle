-- users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  image TEXT, -- Útil para guardar a foto do Google
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- accounts
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'credentials' ou 'oauth'
  provider TEXT NOT NULL, -- 'google', 'github', etc
  provider_account_id TEXT NOT NULL, -- O ID que vem do Google
  password_hash TEXT, -- Só preenchido se for provider 'credentials'
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(provider, provider_account_id)
);

-- cycles
CREATE TABLE IF NOT EXISTS cycles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  weekly_hours INTEGER NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- cycle_subjects
CREATE TABLE IF NOT EXISTS cycle_subjects (
  id SERIAL PRIMARY KEY,
  cycle_id INTEGER NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  affinity_rank INTEGER NOT NULL,
  base_weight INTEGER NOT NULL,
  extra_weight INTEGER NOT NULL,
  final_weight INTEGER NOT NULL,
  recommended_hours INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
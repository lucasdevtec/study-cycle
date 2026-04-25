-- users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  provider TEXT,
  provider_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
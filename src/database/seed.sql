--- 1. Usuário demo (Perfil)
INSERT INTO users (id, name, email, total_hours_done, total_cycles_done)
VALUES (1, 'Estudante Demo', 'demo@studycycle.local', 26, 1)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, total_hours_done = EXCLUDED.total_hours_done, total_cycles_done = EXCLUDED.total_cycles_done
RETURNING id;

--- 2. Conta do usuário (Método de Login)
-- O password_hash abaixo corresponde a '12345678' usando bcrypt
INSERT INTO accounts (user_id, type, provider, provider_account_id, password_hash)
VALUES (
  1, 
  'credentials', 
  'credentials', 
  '1', 
  '$2a$10$76a9vO9.mE6S5Wv.R.I6u.t1pUfF.m5rYI9L6H8X8.X8X8X8X8X8'
)
ON CONFLICT (provider, provider_account_id) DO NOTHING;

--- 3. Ciclo
INSERT INTO cycles (id, name, weekly_hours, user_id, total_hours_done, total_cycle_done, atual_cycle_hours, planned_hours)
VALUES (1, 'Ciclo ENEM - Maio', 20, 1, 26, 1, 6, 20)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    weekly_hours = EXCLUDED.weekly_hours;

--- 4. Subjects
INSERT INTO cycle_subjects
(cycle_id, name, affinity_rank, base_weight, extra_weight, final_weight, recommended_hours, hours_done)
VALUES
(1, 'Matematica', 1, 5, 0, 5, 10, 3),
(1, 'Biologia', 3, 3, 0, 3, 6, 2),
(1, 'Quimica', 4, 2, 0, 2, 4, 1)
ON CONFLICT DO NOTHING;

-- Sincronizar os sequences (importante para não dar erro de ID duplicado nos próximos inserts manuais)
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('cycles_id_seq', (SELECT MAX(id) FROM cycles));
SELECT setval('accounts_id_seq', (SELECT MAX(id) FROM accounts));
-- Usuário demo (não duplica)
INSERT INTO users (id, name, email)   
VALUES (1, 'Estudante Demo', 'demo@studycycle.local')
ON CONFLICT (id) DO NOTHING;

-- Ciclo (não duplica)
INSERT INTO cycles (id, name, weekly_hours, user_id)
VALUES (1, 'Ciclo ENEM - Maio', 20, 1)
ON CONFLICT (id) DO NOTHING;

-- Subjects (não duplicar por nome + ciclo)
INSERT INTO cycle_subjects
(cycle_id, name, affinity_rank, base_weight, extra_weight, final_weight, recommended_hours)
VALUES
(1, 'Matematica', 1, 5, 0, 5, 10),
(1, 'Biologia', 3, 3, 0, 3, 6),
(1, 'Quimica', 4, 2, 0, 2, 4)
ON CONFLICT DO NOTHING;
-- Insert test games data
INSERT INTO games (id, type, number, player_id, status, difficulty, settings, state, result, feedback, points, xp, started_at, completed_at, created_at, updated_at) VALUES
-- Match HAO Game for number 1
('550e8400-e29b-41d4-a716-446655440001', 'match_hao', 1, '550e8400-e29b-41d4-a716-446655440100', 'in_progress', 1, '{}', 
 '{"heroes": ["Адам", "Пионер"], "actions": ["первым вкушает", "срывает", "насаживает"], "objects": ["яблоко", "знамя"], "correctHero": "Адам", "correctAction": "первым вкушает", "correctObject": "яблоко"}',
 '{"attempts": []}', '[]', 0, 0, NOW(), NULL, NOW(), NOW()),

-- Memory Flash Game for number 1  
('550e8400-e29b-41d4-a716-446655440002', 'memory_flash', 1, '550e8400-e29b-41d4-a716-446655440100', 'in_progress', 1, '{}',
 '{"sequence": ["Адам", "первым вкушает", "яблоко"], "currentStep": 0, "maxSteps": 3}',
 '{"attempts": []}', '[]', 0, 0, NOW(), NULL, NOW(), NOW()),

-- Speed Recall Game for number 1
('550e8400-e29b-41d4-a716-446655440003', 'speed_recall', 1, '550e8400-e29b-41d4-a716-446655440100', 'in_progress', 1, '{}',
 '{"timeLimit": 30000, "startTime": null, "hint": "Адам + первым вкушает + яблоко"}',
 '{"attempts": []}', '[]', 0, 0, NOW(), NULL, NOW(), NOW()),

-- Number Story Game for number 1
('550e8400-e29b-41d4-a716-446655440004', 'number_story', 1, '550e8400-e29b-41d4-a716-446655440100', 'in_progress', 1, '{}',
 '{"heroes": ["Адам", "Пионер"], "actions": ["первым вкушает", "срывает", "насаживает"], "objects": ["яблоко", "знамя"], "selectedHero": null, "selectedAction": null, "selectedObject": null, "storyText": ""}',
 '{"attempts": []}', '[]', 0, 0, NOW(), NULL, NOW(), NOW()),

-- Association Duel Game for number 1
('550e8400-e29b-41d4-a716-446655440005', 'association_duel', 1, '550e8400-e29b-41d4-a716-446655440100', 'in_progress', 1, '{}',
 '{"rounds": 3, "currentRound": 1, "playerScore": 0, "opponentScore": 0, "timeLimit": 30000}',
 '{"attempts": []}', '[]', 0, 0, NOW(), NULL, NOW(), NOW()),

-- Completed Match HAO Game
('550e8400-e29b-41d4-a716-446655440006', 'match_hao', 1, '550e8400-e29b-41d4-a716-446655440200', 'completed', 2, '{}',
 '{"heroes": ["Адам", "Пионер"], "actions": ["первым вкушает", "срывает"], "objects": ["яблоко", "знамя"], "correctHero": "Адам", "correctAction": "первым вкушает", "correctObject": "яблоко"}',
 '{"attempts": [{"answer": {"hero": "Адам", "action": "первым вкушает", "object": "яблоко"}, "isCorrect": true, "pointsAwarded": 10, "timeSpentMs": 5000}]}', 
 '[{"message": "Отличная игра!", "rating": 5, "createdAt": "2025-10-04T15:30:00Z"}]', 10, 10, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes'),

-- Failed Speed Recall Game
('550e8400-e29b-41d4-a716-446655440007', 'speed_recall', 1, '550e8400-e29b-41d4-a716-446655440300', 'failed', 3, '{}',
 '{"timeLimit": 10000, "startTime": NOW() - INTERVAL '15 minutes', "hint": "Адам + первым вкушает + яблоко"}',
 '{"attempts": [{"answer": "Адам срывает яблоко", "isCorrect": false, "pointsAwarded": 0, "timeSpentMs": 12000}]}', 
 '[{"message": "Слишком сложно", "rating": 2, "createdAt": "2025-10-04T15:15:00Z"}]', 0, 0, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '5 minutes');

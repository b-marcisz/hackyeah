-- Create database if not exists
CREATE DATABASE assential_db;

-- Connect to the database
\c assential_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create number_associations table
CREATE TABLE IF NOT EXISTS number_associations (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL,
    hero VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    object VARCHAR(255) NOT NULL,
    explanation TEXT,
    is_primary BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    number INTEGER NOT NULL,
    player_id UUID,
    status VARCHAR(20) DEFAULT 'pending',
    difficulty INTEGER DEFAULT 1,
    settings JSONB DEFAULT '{}',
    state JSONB DEFAULT '{}',
    result JSONB DEFAULT '{}',
    feedback JSONB DEFAULT '[]',
    points INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100),
    difficulty INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_number_associations_number ON number_associations(number);
CREATE INDEX IF NOT EXISTS idx_number_associations_primary ON number_associations(is_primary);
CREATE INDEX IF NOT EXISTS idx_games_type ON games(type);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_player_id ON games(player_id);
CREATE INDEX IF NOT EXISTS idx_cards_category ON cards(category);

INSERT INTO number_associations (number, hero, action, object, explanation, is_primary, rating, total_votes) VALUES
(0, 'Mickey Mouse', 'peeks through', 'giant donut', 'Mickey Mouse peeks through a giant donut that looks like the round number 0.', true, 0, 0),
(1, 'Rapunzel', 'holds', 'tall paintbrush', 'Rapunzel holds a tall paintbrush standing straight like the number 1.', true, 0, 0),
(2, 'Peppa Pig', 'hugs', 'banana', 'Peppa Pig hugs a yellow banana curved just like the number 2.', true, 0, 0),
(3, 'Spider-Man', 'twirls', 'garden hose', 'Spider-Man twirls a green garden hose that curls into the shape of the number 3.', true, 0, 0),
(4, 'Woody', 'leans on', 'sturdy chair', 'Woody leans on a sturdy chair and together they make the sharp corners of the number 4.', true, 0, 0),
(5, 'Elsa', 'draws sparkles on', 'candy cane', 'Elsa draws sparkles on a candy cane that bends like the number 5.', true, 0, 0),
(6, 'Lightning McQueen', 'drives around', 'big tire', 'Lightning McQueen drives around a big tire that loops like the number 6.', true, 0, 0),
(7, 'Batman', 'balances', 'umbrella', 'Batman balances an umbrella tilted to look like the top bar of the number 7.', true, 0, 0),
(8, 'Olaf', 'juggles', 'pair of snowballs', 'Olaf juggles a pair of snowballs stacked like the snowman shape of the number 8.', true, 0, 0),
(9, 'Moana', 'spins', 'balloon string', 'Moana spins a bright balloon string that curls down like the tail of the number 9.', true, 0, 0)
ON CONFLICT DO NOTHING;

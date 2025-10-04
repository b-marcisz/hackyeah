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

-- Insert some sample data
INSERT INTO number_associations (number, hero, action, object, explanation, is_primary, rating, total_votes) VALUES
(0, 'Zero', 'stands', 'ground', 'Zero stands on the ground - the foundation of everything', true, 4.5, 10),
(1, 'One', 'points', 'sky', 'One points to the sky - the first direction', true, 4.2, 8),
(2, 'Two', 'dances', 'floor', 'Two dances on the floor - a pair in motion', true, 4.0, 6),
(3, 'Three', 'jumps', 'chair', 'Three jumps on the chair - a trio of energy', true, 4.3, 7),
(4, 'Four', 'sits', 'table', 'Four sits at the table - a quartet at rest', true, 4.1, 5)
ON CONFLICT DO NOTHING;

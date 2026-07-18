-- postgres
CREATE TABLE IF NOT EXISTS chess_games (
    game_id varchar PRIMARY KEY,
    owner_username varchar(20) NOT NULL,
    owner_id bigint REFERENCES users (id),
    opponent_username varchar(20),
    opponent_id bigint REFERENCES users (id),
    finished boolean
);

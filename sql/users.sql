-- postgres
CREATE TABLE IF NOT EXISTS users (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username varchar(20) NOT NULL CONSTRAINT must_be_unique UNIQUE,
    password varchar NOT NULL,
    wins int,
    losses int,
    creation_date timestamptz NOT NULL
);

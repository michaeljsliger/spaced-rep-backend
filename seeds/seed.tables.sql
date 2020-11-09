BEGIN;

TRUNCATE
  "word",
  "language",
  "users";

INSERT INTO "users" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'M Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'French', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'entre nous', 'between us', 2),
  (2, 1, 'alors', 'then', 3),
  (3, 1, 'petite-amie', 'girlfriend', 4),
  (4, 1, 'le ciel', 'the sky', 5),
  (5, 1, 'parler', 'speak', 6),
  (6, 1, 'tromper', 'cheat', 7),
  (7, 1, 'hier', 'yesterday', 8),
  (8, 1, 'formidable', 'extraordinary', 9),
  (9, 1, 'saoule', 'drunk', 10),
  (10, 1, 'faucon', 'falcon', null);
  -- change last reference to 1?

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));

COMMIT;

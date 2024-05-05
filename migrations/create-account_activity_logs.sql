CREATE TABLE
  "account_activity_logs" (
    id SERIAL PRIMARY KEY,
    target_id uuid NOT NULL,
    actor_id uuid NOT NULL,
    action VARCHAR NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_type VARCHAR NOT NULL,
    actor_type VARCHAR NOT NULL,
    details JSON NOT NULL
  );
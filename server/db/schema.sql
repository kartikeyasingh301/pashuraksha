CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  username    TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  role        TEXT CHECK(role IN ('farmer','vet')) NOT NULL,
  name        TEXT,
  district    TEXT,
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reports (
  id                TEXT PRIMARY KEY,
  local_id          TEXT UNIQUE,
  user_id           INTEGER REFERENCES users(id),
  species           TEXT NOT NULL,
  syndrome          TEXT NOT NULL,
  symptoms          TEXT,
  mortality_count   INTEGER DEFAULT 0,
  herd_id           TEXT,
  animal_id         TEXT,
  village           TEXT,
  district          TEXT,
  latitude          REAL,
  longitude         REAL,
  vaccination_status TEXT DEFAULT 'unknown',
  captured_at       TEXT NOT NULL,
  synced_at         TEXT,
  status            TEXT DEFAULT 'REPORT',
  case_id           INTEGER,
  notes             TEXT,
  created_at        TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cases (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  syndrome      TEXT NOT NULL,
  species       TEXT NOT NULL,
  district      TEXT,
  village       TEXT,
  started_at    TEXT,
  status        TEXT DEFAULT 'CASE',
  severity      TEXT DEFAULT 'LOW',
  report_count  INTEGER DEFAULT 0,
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS clusters (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id       INTEGER REFERENCES cases(id),
  label         TEXT,
  center_lat    REAL,
  center_lng    REAL,
  radius_km     REAL DEFAULT 10,
  report_count  INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'CLUSTER',
  detected_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS suspected_outbreaks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  cluster_id    INTEGER REFERENCES clusters(id),
  suspected_at  TEXT DEFAULT (datetime('now')),
  confirmed_at  TEXT,
  confirmed_by  INTEGER REFERENCES users(id),
  status        TEXT DEFAULT 'SUSPECTED',
  notes         TEXT
);

CREATE TABLE IF NOT EXISTS responses (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  outbreak_id     INTEGER REFERENCES suspected_outbreaks(id),
  vet_id          INTEGER REFERENCES users(id),
  action_type     TEXT,
  description     TEXT,
  scheduled_at    TEXT,
  completed_at    TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lab_samples (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id     TEXT REFERENCES reports(id),
  case_id       INTEGER,
  sample_type   TEXT,
  submitted_at  TEXT,
  result        TEXT,
  result_at     TEXT,
  status        TEXT DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS sync_log (
  local_id      TEXT PRIMARY KEY,
  report_id     TEXT,
  synced_at     TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reports_village   ON reports(village);
CREATE INDEX IF NOT EXISTS idx_reports_syndrome  ON reports(syndrome, species);
CREATE INDEX IF NOT EXISTS idx_reports_captured  ON reports(captured_at);
CREATE INDEX IF NOT EXISTS idx_reports_status    ON reports(status);
CREATE INDEX IF NOT EXISTS idx_cases_status      ON cases(status);
CREATE INDEX IF NOT EXISTS idx_clusters_case     ON clusters(case_id);

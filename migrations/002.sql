-- Applied once to existing local SQLite saves. Existing runs stay Mixed.
ALTER TABLE runs ADD COLUMN difficulty TEXT NOT NULL DEFAULT 'mixed';
ALTER TABLE runs ADD COLUMN scoring_version TEXT NOT NULL DEFAULT 'editorial-v1';
INSERT INTO schema_versions VALUES(2);

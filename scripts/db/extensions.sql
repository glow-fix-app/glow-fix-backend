-- scripts/db/extensions.sql
-- Install PostgreSQL extensions
\c glowfix_dev;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "citext";       -- case-insensitive text

-- Confirm extensions installed
SELECT name, default_version, installed_version
FROM pg_available_extensions
WHERE name IN ('uuid-ossp', 'pgcrypto', 'pg_trgm', 'unaccent', 'citext')
ORDER BY name;
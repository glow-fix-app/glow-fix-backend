-- scripts/db/init.sql
-- Creates the test database if it doesn't exist
-- (handled by docker env vars, this is for extra setup)
-- Create test schema
\c
glowfix_dev;

CREATE SCHEMA
IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO glowfix;
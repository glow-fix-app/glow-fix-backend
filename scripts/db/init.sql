-- scripts/db/init.sql
-- Creates the test database if it doesn't exist
-- (handled by docker env vars, this is for extra setup)
-- Create test schema
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create test database
CREATE DATABASE glowfix_test;
GRANT ALL PRIVILEGES ON DATABASE glowfix_test TO glowfix;
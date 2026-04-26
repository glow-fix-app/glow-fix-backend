-- ============================================================
-- GLOW FIX - CAR WASH MANAGEMENT SYSTEM
-- Complete Database Schema DDL
-- Version: 2.0
-- Database: PostgreSQL 15+
-- ============================================================

-- Enable required extensions
CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";
-- UUID generation
CREATE EXTENSION
IF NOT EXISTS "pgcrypto";
-- Encryption functions
CREATE EXTENSION
IF NOT EXISTS "pg_trgm";
-- Fuzzy text search
CREATE EXTENSION
IF NOT EXISTS "btree_gin";
-- GIN index support
CREATE EXTENSION
IF NOT EXISTS "unaccent";
-- Remove accents for search
CREATE EXTENSION
IF NOT EXISTS "pg_stat_statements";
-- Query performance tracking
CREATE EXTENSION
IF NOT EXISTS "postgis";
-- Geospatial (lat/lng distance queries)

-- Set default timezone
SET timezone
= 'UTC';

-- Configure search path
SET search_path
TO public;

-- ============================================================
-- UTILITY FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp on any table
CREATE OR REPLACE FUNCTION trigger_set_updated_at
()
RETURNS TRIGGER AS 
$$
BEGIN
  NEW.updated_at = NOW
();
RETURN NEW;
END;
$$
 LANGUAGE plpgsql;

-- Generate unique referral codes (8 chars, uppercase alphanumeric)
CREATE OR REPLACE FUNCTION generate_referral_code
()
RETURNS TEXT AS 
$$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- removed ambiguous chars
  result TEXT := '';
  i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
    result := result || substr
    (chars, floor
    (random
    () * length
    (chars) + 1)::int, 1);
END LOOP;
RETURN result;
END;
$$
 LANGUAGE plpgsql;

-- Calculate distance between two lat/lng points (km)
CREATE OR REPLACE FUNCTION calculate_distance_km
(
  lat1 FLOAT, lng1 FLOAT,
  lat2 FLOAT, lng2 FLOAT
)
RETURNS FLOAT AS 
$$
BEGIN
    RETURN ST_Distance(
    ST_MakePoint(lng1, lat1)
    ::geography,
    ST_MakePoint
    (lng2, lat2)::geography
  ) / 1000.0;
END;
$$
 LANGUAGE plpgsql IMMUTABLE;

-- Validate mobile number format (E.164 format)
CREATE OR REPLACE FUNCTION is_valid_mobile
(mobile TEXT)
RETURNS BOOLEAN AS 
$$
BEGIN
    RETURN mobile
    ~ '^\+[1-9]\d{7,14}$';
END;
$$
 LANGUAGE plpgsql IMMUTABLE;

-- Soft delete helper: returns only non-deleted rows
-- (Used in RLS policies)
CREATE OR REPLACE FUNCTION is_not_deleted
(deleted_at TIMESTAMPTZ)
RETURNS BOOLEAN AS 
$$
BEGIN
    RETURN deleted_at
    IS NULL;
END;
$$
 LANGUAGE plpgsql IMMUTABLE;
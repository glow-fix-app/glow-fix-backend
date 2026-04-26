-- ============================================================
-- CUSTOMERS
-- ============================================================

CREATE TABLE customers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  full_name             VARCHAR(100) NOT NULL,
  mobile_number         VARCHAR(20) NOT NULL
                          CONSTRAINT customers_mobile_format
                          CHECK (is_valid_mobile(mobile_number)),
  email                 VARCHAR(255) NOT NULL,
  password_hash         VARCHAR(255),        -- NULL for OAuth-only accounts
  birthdate             DATE,
  gender                VARCHAR(20),         -- optional, for personalization
  profile_photo_url     TEXT,

  -- Location (home location for nearby search)
  home_location_lat     FLOAT
                          CONSTRAINT customers_lat_range
                          CHECK (home_location_lat BETWEEN -90 AND 90),
  home_location_lng     FLOAT
                          CONSTRAINT customers_lng_range
                          CHECK (home_location_lng BETWEEN -180 AND 180),
  home_address          TEXT,

  -- Account status & verification
  status                account_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
  email_verified        BOOLEAN NOT NULL DEFAULT FALSE,
  mobile_verified       BOOLEAN NOT NULL DEFAULT FALSE,

  -- Two-factor authentication
  two_factor_enabled    BOOLEAN NOT NULL DEFAULT FALSE,
  two_factor_secret     TEXT,                -- TOTP secret (encrypted)
  backup_codes          TEXT[],              -- hashed backup codes

  -- Loyalty
  loyalty_points        INTEGER NOT NULL DEFAULT 0
                          CONSTRAINT customers_points_non_negative
                          CHECK (loyalty_points >= 0),
  total_points_earned   INTEGER NOT NULL DEFAULT 0,
  total_points_redeemed INTEGER NOT NULL DEFAULT 0,
  points_expiry_date    TIMESTAMPTZ,         -- next scheduled expiry check

  -- Business metrics (denormalized for performance)
  total_spent           BIGINT NOT NULL DEFAULT 0, -- in cents
  total_bookings        INTEGER NOT NULL DEFAULT 0,
  total_reviews         INTEGER NOT NULL DEFAULT 0,
  average_rating_given  FLOAT,

  -- Referral
  referral_code         VARCHAR(8) UNIQUE NOT NULL
                          DEFAULT generate_referral_code(),
  referred_by           UUID REFERENCES customers(id)
                          ON DELETE SET NULL,

  -- Consent & compliance (GDPR)
  marketing_consent     BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent_at  TIMESTAMPTZ,
  terms_accepted_at     TIMESTAMPTZ,
  privacy_accepted_at   TIMESTAMPTZ,
  data_export_requested BOOLEAN NOT NULL DEFAULT FALSE,
  data_export_at        TIMESTAMPTZ,

  -- Preferences
  preferred_language    VARCHAR(10) NOT NULL DEFAULT 'en',
  preferred_currency    VARCHAR(3) NOT NULL DEFAULT 'USD',
  timezone              VARCHAR(50) NOT NULL DEFAULT 'UTC',

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at        TIMESTAMPTZ,
  deleted_at            TIMESTAMPTZ          -- soft delete

  CONSTRAINT customers_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Unique constraints (excluding soft-deleted records)
CREATE UNIQUE INDEX uidx_customers_email
  ON customers(lower(email))
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX uidx_customers_mobile
  ON customers(mobile_number)
  WHERE deleted_at IS NULL;

-- Trigger: auto-update updated_at
CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- CUSTOMER OAuth ACCOUNTS
-- Links Google/Apple/Facebook accounts to customers
-- ============================================================

CREATE TABLE customer_oauth_accounts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id       UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  provider          VARCHAR(50) NOT NULL,  -- 'google' | 'apple' | 'facebook'
  provider_id       VARCHAR(255) NOT NULL, -- unique ID from provider
  email             VARCHAR(255),
  email_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  profile_photo_url TEXT,
  access_token      TEXT,                  -- encrypted
  refresh_token     TEXT,                  -- encrypted
  token_expires_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT customer_oauth_unique
    UNIQUE (provider, provider_id)
);

CREATE TRIGGER customer_oauth_updated_at
  BEFORE UPDATE ON customer_oauth_accounts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- OTP CODES
-- Handles all OTP verification flows
-- ============================================================

CREATE TABLE otp_codes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier      VARCHAR(255) NOT NULL, -- mobile or email
  code            VARCHAR(6) NOT NULL,   -- 6-digit code (hashed)
  purpose         otp_purpose NOT NULL,
  attempts        INTEGER NOT NULL DEFAULT 0,
  max_attempts    INTEGER NOT NULL DEFAULT 5,
  is_used         BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at      TIMESTAMPTZ NOT NULL,
  used_at         TIMESTAMPTZ,
  ip_address      INET,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT otp_max_attempts
    CHECK (max_attempts BETWEEN 1 AND 10)
);

-- Auto-delete expired OTPs (handled by background job, but index helps)
CREATE INDEX idx_otp_identifier_purpose
  ON otp_codes(identifier, purpose)
  WHERE is_used = FALSE;

CREATE INDEX idx_otp_expires_at
  ON otp_codes(expires_at)
  WHERE is_used = FALSE;

-- ============================================================
-- STAFF / TECHNICIANS
-- ============================================================

CREATE TABLE staff (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  full_name             VARCHAR(100) NOT NULL,
  mobile_number         VARCHAR(20) NOT NULL
                          CONSTRAINT staff_mobile_format
                          CHECK (is_valid_mobile(mobile_number)),
  email                 VARCHAR(255) NOT NULL,
  password_hash         VARCHAR(255) NOT NULL,
  profile_photo_url     TEXT,

  -- Professional info
  license_number        VARCHAR(100),
  specialty             service_type[] NOT NULL DEFAULT '{}',
                          -- e.g., '{WASH, POLISH}'
  employee_id           VARCHAR(50) UNIQUE,
  hire_date             DATE,
  termination_date      DATE,

  -- Compensation
  hourly_rate           INTEGER NOT NULL DEFAULT 0, -- in cents

  -- Account
  status                account_status NOT NULL DEFAULT 'PENDING_ACTIVATION',
  is_available          BOOLEAN NOT NULL DEFAULT TRUE,
  car_wash_id           UUID,                       -- primary location
                                                    -- FK added after car_washes table

  -- Performance metrics (denormalized, updated by triggers/jobs)
  average_rating        FLOAT DEFAULT 0
                          CONSTRAINT staff_rating_range
                          CHECK (average_rating BETWEEN 0 AND 5),
  total_jobs_completed  INTEGER NOT NULL DEFAULT 0,
  total_jobs_today      INTEGER NOT NULL DEFAULT 0,
  average_service_time  INTEGER,                    -- minutes, rolling avg

  -- Auth
  two_factor_enabled    BOOLEAN NOT NULL DEFAULT FALSE,
  two_factor_secret     TEXT,
  temp_password_hash    VARCHAR(255),              -- for first-login flow
  must_change_password  BOOLEAN NOT NULL DEFAULT TRUE,

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at         TIMESTAMPTZ,
  deleted_at            TIMESTAMPTZ,

  CONSTRAINT staff_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE UNIQUE INDEX uidx_staff_email
  ON staff(lower(email))
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX uidx_staff_mobile
  ON staff(mobile_number)
  WHERE deleted_at IS NULL;

CREATE TRIGGER staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- STAFF AVAILABILITY & SCHEDULE
-- ============================================================

CREATE TABLE staff_availability (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id      UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  day_of_week   day_of_week NOT NULL,
  start_time    TIME NOT NULL,           -- e.g., '09:00'
  end_time      TIME NOT NULL,           -- e.g., '17:00'
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT availability_time_order
    CHECK (start_time < end_time),
  CONSTRAINT staff_availability_unique
    UNIQUE (staff_id, day_of_week)
);

CREATE TRIGGER staff_availability_updated_at
  BEFORE UPDATE ON staff_availability
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- STAFF TIME OFF REQUESTS
-- ============================================================

CREATE TABLE staff_time_off (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id        UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  reason          TEXT,
  status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                    -- PENDING | APPROVED | REJECTED
  reviewed_by     UUID,                  -- FK to admins added later
  reviewed_at     TIMESTAMPTZ,
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT time_off_date_order
    CHECK (start_date <= end_date)
);

CREATE TRIGGER staff_time_off_updated_at
  BEFORE UPDATE ON staff_time_off
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- ADMINS
-- ============================================================

CREATE TABLE admins (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name             VARCHAR(100) NOT NULL,
  email                 VARCHAR(255) NOT NULL,
  password_hash         VARCHAR(255) NOT NULL,
  profile_photo_url     TEXT,

  -- Role & permissions
  role                  user_role NOT NULL DEFAULT 'VIEWER',
  permissions           TEXT[] NOT NULL DEFAULT '{}',
  is_system_account     BOOLEAN NOT NULL DEFAULT FALSE, -- cannot be deleted

  -- MFA (mandatory for admins)
  two_factor_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  two_factor_secret     TEXT NOT NULL DEFAULT '',
  backup_codes          TEXT[],

  -- Security
  ip_whitelist          INET[],              -- optional IP restriction
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until          TIMESTAMPTZ,

  -- Audit
  last_login_at         TIMESTAMPTZ,
  last_login_ip         INET,
  password_changed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  must_change_password  BOOLEAN NOT NULL DEFAULT FALSE,

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by            UUID REFERENCES admins(id) ON DELETE SET NULL,
  deleted_at            TIMESTAMPTZ,

  CONSTRAINT admins_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE UNIQUE INDEX uidx_admins_email
  ON admins(lower(email))
  WHERE deleted_at IS NULL;

CREATE TRIGGER admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- USER SESSIONS (Redis-backed, but DB record for audit)
-- ============================================================

CREATE TABLE user_sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL,
  user_type         VARCHAR(20) NOT NULL,  -- 'customer' | 'staff' | 'admin'
  session_token     VARCHAR(255) NOT NULL UNIQUE,
  refresh_token     VARCHAR(255) NOT NULL UNIQUE,
  device_type       VARCHAR(20),           -- 'mobile' | 'desktop' | 'tablet'
  browser           VARCHAR(100),
  operating_system  VARCHAR(100),
  ip_address        INET,
  user_agent        TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  remember_me       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at        TIMESTAMPTZ NOT NULL,
  revoked_at        TIMESTAMPTZ,
  revoke_reason     VARCHAR(100)           -- 'logout' | 'force_logout' | 'expired'
);

CREATE INDEX idx_sessions_user
  ON user_sessions(user_id, user_type)
  WHERE is_active = TRUE;

CREATE INDEX idx_sessions_token
  ON user_sessions(session_token)
  WHERE is_active = TRUE;
-- ============================================================
-- ENUM TYPES
-- All application enumerations defined centrally
-- ============================================================

-- User roles
CREATE TYPE user_role AS ENUM (
  'CUSTOMER',
  'STAFF',
  'OPERATIONS_MANAGER',
  'FINANCE_ADMIN',
  'CONTENT_MANAGER',
  'SUPPORT_AGENT',
  'SUPER_ADMIN',
  'VIEWER'
);

-- Account status
CREATE TYPE account_status AS ENUM (
  'PENDING_VERIFICATION', -- awaiting OTP
  'ACTIVE',
  'SUSPENDED',
  'DEACTIVATED',          -- soft deleted
  'PENDING_ACTIVATION'    -- staff awaiting first login
);

-- Service types
CREATE TYPE service_type AS ENUM (
  'WASH',
  'POLISH',
  'DETAILING',
  'COMBO',
  'ADD_ON'
);

-- Booking status (full lifecycle)
CREATE TYPE booking_status AS ENUM (
  'PENDING',              -- created, awaiting payment
  'CONFIRMED',            -- payment received
  'QUEUED',               -- customer arrived
  'IN_PROGRESS',          -- service started
  'QUALITY_CHECK',        -- final inspection
  'COMPLETED',            -- done, picked up
  'CANCELLED',            -- cancelled by customer/staff/admin
  'NO_SHOW',              -- customer didn't arrive
  'CUSTOMER_REFUSED_DIVR' -- refused to sign inspection
);

-- Granular staff service stages
CREATE TYPE service_stage AS ENUM (
  'PRE_WASH',
  'WASH_IN_PROGRESS',
  'DRYING',
  'INTERIOR_CLEANING',
  'POLISHING',
  'WAXING',
  'DETAILING',
  'ENGINE_BAY_CLEANING',
  'QUALITY_CHECK',
  'READY_FOR_PICKUP'
);

-- Payment methods
CREATE TYPE payment_method AS ENUM (
  'STRIPE',
  'PAYPAL',
  'CASH',
  'LOYALTY_POINTS',
  'SPLIT',                -- multiple payment methods
  'SUBSCRIPTION'          -- covered by subscription plan
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
  'PENDING',
  'PROCESSING',
  'PAID',
  'FAILED',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
  'DISPUTED',
  'CANCELLED'
);

-- Payment transaction types
CREATE TYPE transaction_type AS ENUM (
  'CHARGE',
  'REFUND',
  'PARTIAL_REFUND',
  'DISPUTE',
  'CHARGEBACK'
);

-- Loyalty point transaction types
CREATE TYPE loyalty_transaction_type AS ENUM (
  'EARNED',              -- from purchase
  'REDEEMED',            -- used for discount
  'EXPIRED',             -- 6-month inactivity
  'BONUS',               -- review, referral bonus
  'REVERSED',            -- booking cancelled
  'ADJUSTED'             -- admin manual adjustment
);

-- Subscription plans
CREATE TYPE subscription_plan AS ENUM (
  'BASIC',               -- \$29.99/month
  'PREMIUM',             -- \$49.99/month
  'ULTIMATE'             -- \$79.99/month
);

-- Subscription status
CREATE TYPE subscription_status AS ENUM (
  'ACTIVE',
  'PAUSED',
  'CANCELLED',
  'PAST_DUE',            -- payment failed, in grace period
  'EXPIRED',
  'TRIAL'                -- future: free trial
);

-- Review/rating categories
CREATE TYPE review_status AS ENUM (
  'VISIBLE',
  'HIDDEN',              -- admin-hidden
  'FLAGGED',             -- flagged by users, pending review
  'DELETED'
);

-- Warranty claim status
CREATE TYPE warranty_status AS ENUM (
  'ACTIVE',
  'EXPIRED',
  'CLAIMED',
  'VOID'                 -- voided due to misuse
);

-- Warranty claim processing status
CREATE TYPE claim_status AS ENUM (
  'PENDING',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'COMPLETED'
);

-- Referral status
CREATE TYPE referral_status AS ENUM (
  'PENDING',             -- referee registered but not yet booked
  'ACTIVATED',           -- referee completed first booking
  'EXPIRED',             -- 30-day attribution window passed
  'REWARDED'             -- points already issued
);

-- Notification channels
CREATE TYPE notification_channel AS ENUM (
  'EMAIL',
  'SMS',
  'WHATSAPP',
  'PUSH',
  'IN_APP'
);

-- Notification status
CREATE TYPE notification_status AS ENUM (
  'QUEUED',
  'SENDING',
  'DELIVERED',
  'FAILED',
  'BOUNCED',
  'READ'
);

-- Content status
CREATE TYPE content_status AS ENUM (
  'DRAFT',
  'PUBLISHED',
  'SCHEDULED',
  'ARCHIVED'
);

-- Damage types for DIVR
CREATE TYPE damage_type AS ENUM (
  'SCRATCH',
  'DENT',
  'CHIP',
  'CRACK',
  'STAIN',
  'MISSING_PART',
  'RUST',
  'OTHER'
);

-- Damage severity
CREATE TYPE damage_severity AS ENUM (
  'MINOR',
  'MODERATE',
  'SEVERE'
);

-- Vehicle location zones for DIVR
CREATE TYPE vehicle_zone AS ENUM (
  'FRONT',
  'REAR',
  'LEFT_SIDE',
  'RIGHT_SIDE',
  'ROOF',
  'HOOD',
  'TRUNK',
  'UNDERCARRIAGE',
  'INTERIOR',
  'WHEELS'
);

-- Staff assignment status
CREATE TYPE assignment_status AS ENUM (
  'ASSIGNED',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'TRANSFERRED',
  'DECLINED'
);

-- Order status (product store)
CREATE TYPE order_status AS ENUM (
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'READY_FOR_PICKUP',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
  'REFUNDED'
);

-- Security event severity
CREATE TYPE security_severity AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);

-- Audit action categories
CREATE TYPE audit_action AS ENUM (
  'CREATE',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'EXPORT',
  'REFUND',
  'SUSPEND',
  'ACTIVATE',
  'PERMISSION_CHANGE',
  'CONFIG_CHANGE'
);

-- Payment terms (fleet accounts)
CREATE TYPE payment_terms AS ENUM (
  'IMMEDIATE',
  'NET_15',
  'NET_30',
  'NET_60'
);

-- OTP purpose
CREATE TYPE otp_purpose AS ENUM (
  'REGISTRATION',
  'LOGIN',
  'PASSWORD_RESET',
  'MFA',
  'PHONE_CHANGE',
  'EMAIL_CHANGE'
);

-- Day of week
CREATE TYPE day_of_week AS ENUM(
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
);
import { Prisma } from '@prisma/client';

export const BOOKING_FULL_INCLUDE = {
  vehicle: true,
  business: true,
  notes: true,
  statusHistory: {
    include: { status: true },
    orderBy: { createdAt: 'asc' as Prisma.SortOrder }
  },
  items: {
    include: {
      businessService: {
        include: { service: true }
      }
    }
  },
  payment: {
    include: {
      status: true,
      paymentMethod: true
    }
  }
} satisfies Prisma.BookingInclude;

export const BOOKING_WITH_CLIENT_INCLUDE = {
  ...BOOKING_FULL_INCLUDE,
  vehicle: {
    include: {
      client: {
        include: { user: true }
      }
    }
  },
  cancellation: true,
  diagnosticReport: {
    include: {
      findings: true,
      recommendedRepairs: true
    }
  }
} satisfies Prisma.BookingInclude;

export const BOOKING_MANAGER_ADMIN_INCLUDE = {
  ...BOOKING_WITH_CLIENT_INCLUDE
} satisfies Prisma.BookingInclude;

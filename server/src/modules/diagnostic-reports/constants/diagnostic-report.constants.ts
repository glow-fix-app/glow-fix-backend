export enum FindingPriority {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export enum ClientAction {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export const DIAGNOSTIC_EVENTS = {
  REPORT_CREATED: 'diagnostic.report_created',
  CLIENT_RESPONDED: 'diagnostic.client_responded',
} as const;

export const DEFAULT_VALID_HOURS = 72;
export const MAX_PAGE_SIZE = 50;

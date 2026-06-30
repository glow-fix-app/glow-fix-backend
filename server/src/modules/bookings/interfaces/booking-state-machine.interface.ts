export interface IBookingStateMachine {
  /**
   * Validates that a transition from `current` to `target` status is allowed.
   * Throws `BadRequestException` if the transition is invalid.
   */
  validateTransition(current: string, target: string): void;

  /**
   * Returns the context string of the latest status from a booking's status history array.
   * Defaults to `'PENDING'` if the history is empty.
   */
  getLatestStatusContext(statusHistory: any[]): string;
}

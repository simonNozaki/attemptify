import {AbstractRetryEvent} from './retry-event';

/**
 * Retry event implementation on success.
 */
export class RetryEventOnSuccess implements AbstractRetryEvent {
  /**
   * @param {number} attemptCounts
   */
  constructor(
    private attemptCounts: number,
  ) {}
  /**
   * @return {number}
   */
  getAttemptCounts(): number {
    return this.attemptCounts;
  }
  /**
   * @return {boolean}
   */
  isSuccess(): boolean {
    return true;
  }
  /**
   *
   * @return {boolean}
   */
  isFailure(): boolean {
    return false;
  }
}

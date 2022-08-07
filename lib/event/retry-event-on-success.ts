import {AbstractRetryEvent} from './retry-event';
import {RetryEventOnFailed} from './retry-event-on-failed';

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
  isSuccess(): this is RetryEventOnSuccess {
    return true;
  }
  /**
   *
   * @return {boolean}
   */
  isFailure(): this is RetryEventOnFailed {
    return false;
  }
}

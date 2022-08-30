import {AbstractRetryEvent} from './retry-event';
import {RetryEventOnSuccess} from './retry-event-on-success';

/**
 * Retry event implementation on failed
 */
export class RetryEventOnFailed implements AbstractRetryEvent {
  /**
   * @param {number} attemptCounts
   */
  constructor(
    private attemptCounts: number,
    private lastError: Error,
  ) {}
  /**
   * Return total counts of attempts.
   * @return {number}
   */
  getAttemptCounts(): number {
    return this.attemptCounts;
  }
  /**
   * Return true
   * @return {boolean}
   */
  isSuccess(): this is RetryEventOnSuccess {
    return false;
  }
  /**
   * Return false
   * @return {boolean}
   */
  isFailure(): this is RetryEventOnFailed {
    return true;
  }
  /**
   * Return a last error of a series of attempts.
   * @return {Error}
   */
  getLastError(): Error {
    return this.lastError;
  }
}

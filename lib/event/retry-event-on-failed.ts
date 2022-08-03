import {AbstractRetryEvent} from './retry-event';

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
  isSuccess(): boolean {
    return false;
  }
  /**
   * Return false
   * @return {boolean}
   */
  isFailure(): boolean {
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

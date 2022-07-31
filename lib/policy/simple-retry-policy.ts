import {Duration} from '../duration';
import {RetryContext} from '../retry-context';
import {RetryPolicy} from './retry-policy';

/**
 * Basic retry policy: wait simply duration milliseconds.
 */
export class SimpleRetryPolicy implements RetryPolicy {
  /**
   * @param {number} _durationMsec
   * @param {number} _maxAttempts
   */
  constructor(
    private _durationMsec: Duration,
    private _maxAttempts: number,
  ) {}
  /**
   * @param {SimpleRetryPolicy} retryPolicy
   * @return {boolean}
   */
  equals(retryPolicy: SimpleRetryPolicy): boolean {
    return this._maxAttempts === retryPolicy._maxAttempts &&
      this._durationMsec === retryPolicy.durationMsec;
  }
  /**
   * @return {string}
   */
  toString(): string {
    return `SimpleRetryPolicy(
      durationMsec=${this._durationMsec}), maxAttemps=${this._maxAttempts}
    )`;
  }

  /**
   *
   * @param {RetryContext} retryContext
   * @return {boolean} if a passed context can continue retrying
   */
  canRetry(retryContext: RetryContext): boolean {
    return !retryContext.lastError ||
      retryContext.attemptsCount < this._maxAttempts;
  }

  /**
   *
   * @param {RetryContext} retryContext
   * @return {number} retrun next delay milliseconds
   */
  getNextDelay(): Duration {
    return this._durationMsec;
  }

  /**
   */
  get maxAttempts(): number {
    return this._maxAttempts;
  }

  /**
   */
  get durationMsec(): Duration {
    return this._durationMsec;
  }
}

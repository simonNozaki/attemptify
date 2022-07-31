import {Duration, seconds} from 'lib/duration';
import {RetryContext} from '../retry-context';
import {RetryPolicy} from './retry-policy';
import {ErrorConstructor} from './retry-policy';

/**
 * Retry policy: exponential backoff
 * This policy allow context to retry waiting exponential duration.
 * Interval duration is: `initialDelay ^ (multiplier - attemptCount)`
 */
export class ExponentialBackOffRetryPolicy implements RetryPolicy {
  private errorsNotRetryOn: ErrorConstructor[] = [];
  /**
   * @param {number} _initialDelay
   * @param {number} _maxAttempts
   * @param {number} _multiplier
   */
  constructor(
    private _initialDelay: Duration,
    private _maxAttempts: number,
    private _multiplier: number,
  ) {}
  private currentDelay = this._initialDelay;

  // eslint-disable-next-line require-jsdoc
  get initialDelay(): Duration {
    return this._initialDelay;
  }
  // eslint-disable-next-line require-jsdoc
  get maxAttempts(): number {
    return this._maxAttempts;
  }
  // eslint-disable-next-line require-jsdoc
  get multiplier(): number {
    return this._multiplier;
  }

  /**
   * Creates a new Simple Retry policy with default settings
   * * interval duration ... 1 second
   * * max attempts ... 5 times
   * * multiplier of duration ... 2
   * @return {RetryPolicy}
   */
  static ofDefaults(): RetryPolicy {
    return new ExponentialBackOffRetryPolicy(seconds(1), 4, 2);
  }

  /**
   * Add an error to the list not retrying on it.
   * @param {Error} e
   */
  notRetryOn(e: ErrorConstructor): void {
    this.errorsNotRetryOn.push(e);
  }

  /**
   * Return true if a passed error should not be retryed.
   * @param {Error} e
   * @return {boolean}
   */
  shouldNotRetry(e: Error): boolean {
    return this.errorsNotRetryOn.some((v) => e instanceof v);
  }

  /**
   * @param {ExponentialBackOffRetryPolicy} retryPolicy
   * @return {boolean}
   */
  equals(retryPolicy: ExponentialBackOffRetryPolicy): boolean {
    return this._initialDelay === retryPolicy.initialDelay &&
      this._maxAttempts === retryPolicy.maxAttempts &&
      this._multiplier === retryPolicy._multiplier;
  }

  /**
   * @return {string}
   */
  toString(): string {
    return `ExponentialBackOffRetryPolicy(
      _initialDelay=${this._initialDelay}),
      maxAttemps=${this._maxAttempts},
      multiplier=${this._multiplier}
    )`;
  }
  /**
   *
   * @param {RetryContext} retryContext
   * @return {boolean} retrun true if attempts count is less than max attempts
   */
  canRetry(retryContext: RetryContext): boolean {
    return !retryContext.lastError ||
      retryContext.attemptsCount < this._maxAttempts;
  }
  /**
   * Return next delay milliseconds
   * @param {RetryContext} retryContext
   * @return {number}
   */
  getNextDelay(): Duration {
    this.currentDelay = this.currentDelay.multiply(this._multiplier);
    return this.currentDelay;
  }
}

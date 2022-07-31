import {Duration, seconds} from '../duration';
import {RetryContext} from '../retry-context';
import {RetryPolicy} from './retry-policy';
import {ErrorConstructor} from './retry-policy';

/**
 * Basic retry policy: wait simply duration milliseconds.
 */
export class SimpleRetryPolicy implements RetryPolicy {
  private errorsNotRetryOn: ErrorConstructor[] = [];
  /**
   * @param {number} _durationMsec
   * @param {number} _maxAttempts
   */
  constructor(
    private _durationMsec: Duration,
    private _maxAttempts: number,
  ) {}
  /**
   * Creates a new Simple Retry policy with default settings
   * * interval duration ... 1 second
   * * max attempts ... 5 times
   * @return {RetryPolicy}
   */
  static ofDefaults(): RetryPolicy {
    return new SimpleRetryPolicy(seconds(1), 4);
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

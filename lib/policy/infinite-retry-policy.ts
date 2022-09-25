import {Duration, seconds} from '@/duration';
import {RetryContext} from '@/retry-context';
import {ErrorConstructor, RetryPolicy} from './retry-policy';

/**
 * Retry policy that will try infintely.
 */
export class InfiniteRetryPolicy implements RetryPolicy {
  private errorsNotRetryOn: ErrorConstructor[] = [];
  /**
   * @param {Duration} _duration
   */
  constructor(
    private _duration: Duration,
  ) {}
  /**
   * Return the {@link InfiniteRetryPolicy} instance of default settings.
   * @return {RetryPolicy}
   */
  static ofDefaults(): RetryPolicy {
    return new InfiniteRetryPolicy(seconds(1));
  }
  /**
   * Return always true to retry infinitely.
   * @param {RetryContext} retryContext
   * @return {boolean}
   */
  canRetry(retryContext: RetryContext): boolean {
    return true;
  }
  /**
   *
   * @param {RetryContext} retryContext
   * @return {number} retrun next delay milliseconds
   */
  getNextDelay(): Duration {
    return this._duration;
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
   * @param {InfiniteRetryPolicy} retryPolicy
   * @return {boolean}
   */
  equals(retryPolicy: InfiniteRetryPolicy): boolean {
    return this._duration.equals(retryPolicy.duration);
  }
  /**
   * @return {string}
   */
  toString(): string {
    return `InfiniteRetryPolicy(duration=${this._duration}))`;
  }

  /**
   */
  get duration(): Duration {
    return this._duration;
  }
}

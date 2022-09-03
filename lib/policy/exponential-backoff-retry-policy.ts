import {Multiplier, multiplierOf} from '../multiplier';
import {Duration, seconds} from '@/duration';
import {RetryContext} from '@/retry-context';
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
    private readonly _initialDelay: Duration,
    private readonly _maxAttempts: number,
    private readonly _multiplier: Multiplier,
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
  get multiplier(): Multiplier {
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
    return new ExponentialBackOffRetryPolicy(seconds(1), 4, multiplierOf(2));
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

export namespace ExponentialBackOffRetryPolicy {
  export const newBuilder = (): ExponentialBackOffRetryPolicy.Builder => {
    return new Builder();
  };

  /**
   * Exponential backoff policy builder
   */
  export class Builder {
    private _initialDelay?: Duration;
    private _maxAttempts?: number;
    private _multiplier?: Multiplier;
    private errorsNotRetryOn: ErrorConstructor[] = [];

    /**
     * Set initial delay duration to builder
     * @param {Duration} delay
     * @return {Builder}
     */
    initialDelay(delay: Duration): Builder {
      this._initialDelay = delay;
      return this;
    }

    /**
     * Set max attempts to builder
     * @param {number} attempts
     * @return {Builder}
     */
    maxAttempts(attempts: number): Builder {
      this._maxAttempts = attempts;
      return this;
    }

    /**
     * Set multiplier of next delay to builder
     * @param {number} multiplier
     * @return {Builder}
     */
    multiplier(multiplier: Multiplier): Builder {
      this._multiplier = multiplier;
      return this;
    }

    /**
     * Set an error not retry on to builder
     * @param {ErrorConstructor} e
     * @return {Builder}
     */
    notRetryOn(e: ErrorConstructor): Builder {
      this.notRetrysOn([e]);
      return this;
    }

    /**
     * Set an error not retry on to builder
     * @param {ErrorConstructor[]} constructors
     * @return {Builder}
     */
    notRetrysOn(constructors: ErrorConstructor[]): Builder {
      constructors.forEach((c) => this.errorsNotRetryOn.push(c));
      return this;
    }

    /**
     * Create new {@link ExponentialBackOffRetryPolicy} with properties.
     * Properties that is not set will be default settings.
     * @return {ExponentialBackOffRetryPolicy}
     */
    build(): ExponentialBackOffRetryPolicy {
      const initialDelay = this._initialDelay ? this._initialDelay : seconds(1);
      const maxAttemps = this._maxAttempts ? this._maxAttempts : 4;
      const multiplier = this._multiplier ? this._multiplier : multiplierOf(2);
      const policy =
        new ExponentialBackOffRetryPolicy(initialDelay, maxAttemps, multiplier);
      this.errorsNotRetryOn.forEach((e) => policy.notRetryOn(e));

      return policy;
    }
  }
}

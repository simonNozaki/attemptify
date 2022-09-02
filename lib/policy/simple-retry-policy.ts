import {Duration, seconds} from '../duration';
import {RetryContext} from '../retry-context';
import {RetryPolicy} from './retry-policy';
import {ErrorConstructor} from './retry-policy';

/**
 * Basic retry policy: wait constant duration milliseconds in this class.
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

export namespace SimpleRetryPolicy {
  export const newBuilder = (): SimpleRetryPolicy.Builder => {
    return new SimpleRetryPolicy.Builder();
  };

  /**
   * Builder for {@link SimpleRetryPolicy}
   */
  export class Builder {
    private _duration?: Duration;
    private _maxAttempts?: number;
    private errorsNotRetryOn: ErrorConstructor[] = [];

    /**
     * Set duration of interval to builder
     * @param {Duration} duration
     * @return {Builder}
     */
    duration(duration: Duration): Builder {
      this._duration = duration;
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
     * Create new {@link SimpleRetryPolicy} with properties.
     * Properties that is not set will be default settings.
     * @return {SimpleRetryPolicy}
     */
    build(): SimpleRetryPolicy {
      const duration = this._duration ? this._duration : seconds(1);
      const maxAttempts = this._maxAttempts ? this._maxAttempts : 4;
      const policy = new SimpleRetryPolicy(duration, maxAttempts);
      this.errorsNotRetryOn.forEach((e) => policy.notRetryOn(e));

      return policy;
    }
  }
}

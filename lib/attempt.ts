import {Duration} from './duration';
import {ExhaustedRetryException} from './exception';
import {RetryEventLister} from './listener/retry-event-lister';
import {RetryPolicy} from './policy/retry-policy';
import {RetryContext} from './retry-context';

/**
 * Attempt handler.
 * This class organizes a retry context and policy so that handles some attempts
 */
export class Attempt {
  private readonly retryContext: RetryContext;
  /**
   * @param {RetryPolicy} retryPolicy
   */
  constructor(
    private retryPolicy: RetryPolicy,
  ) {
    this.retryContext = new RetryContext();
  }
  private requireDebugLogging = false;
  private retryEventListeners: RetryEventLister[] = [];

  /**
   * Add retry event listener to this attempt, so that
   * listening each events
   * @param {RetryEventLister} retryEventListener
   * @return {Attempt}
   */
  addListener(retryEventListener: RetryEventLister): Attempt {
    this.addListeners([retryEventListener]);
    return this;
  }

  /**
   * Add some retry event listeners to this attempt.
   * This stacks listeners, so those subscribe events by popping.
   * @param {RetryEventLister} retryEventListeners
   * @return {Attempt} return `this`
   */
  addListeners(retryEventListeners: RetryEventLister[]): Attempt {
    retryEventListeners.forEach((listener) =>
      this.retryEventListeners.push(listener),
    );
    return this;
  }

  /**
   * Enable this attempt to debug-log
   * @return {Attempt}
   */
  enableDebugLogging(): Attempt {
    this.requireDebugLogging = true;
    return this;
  }

  /**
   *
   * @param {Function} producer
   * @return {Promise<T>} Promise
   * @throws {@link ExhaustedRetryException} when exhausting `producer`
   */
  async executeAsync<T>(producer: () => Promise<T>): Promise<T> {
    return this.doOnRetryAsync(producer);
  }

  /**
   *
   * @param {Function} producer
   * @param {Function} another
   * @return {Promise<T>}
   */
  async executeAsyncOrElse<T>(
      producer: () => Promise<T>,
      another: () => Promise<T>,
  ): Promise<T> {
    return this.doOnRetryAsync(producer, another);
  }

  /**
   * Trys attempting and handles producers.
   * If `another` is passed, exhausting attempts, execute `another`.
   * @param {Function} producer
   * @param {Function} another
   * @return {Promise<T>}
   */
  private async doOnRetryAsync<T>(
      producer: () => Promise<T>,
      another?: () => Promise<T>,
  ): Promise<T> {
    while (this.retryPolicy.canRetry(this.retryContext)) {
      // TODO add some specific type for attempts(success/failure)
      try {
        return await producer();
      } catch (e) {
        if (this.retryPolicy.shouldNotRetry(e)) {
          this.logDebugIfRequire(
              this.requireDebugLogging,
              `Not retry catching error [${e.name}]`,
          );
          break;
        }
        this.retryContext.updateLastError(e);
        const delay = this.retryPolicy.getNextDelay();
        this.logDebugIfRequire(
            this.requireDebugLogging,
            `Attempt failed; count => ${this.retryContext.attemptsCount}`,
        );
        this.logDebugIfRequire(
            this.requireDebugLogging,
            `next waiting ===> ${delay.toMilliSecconds()}`,
        );
        await this.wait(delay);
      }
    }
    if (another) {
      return await another();
    }
    throw new ExhaustedRetryException('Attempt exhaustetd.');
  }

  /**
   *
   * @param {boolean} requireDebugLogging
   * @param {string} message
   */
  private logDebugIfRequire(
      requireDebugLogging: boolean,
      message: string,
  ): void {
    if (requireDebugLogging) {
      console.log(message);
    }
  }

  /**
   * Executing `producer` until exhausting along with `RetryPolicy`.
   * @param {Function} producer
   * @return {Promise<T>}
   * @throws {@link ExhaustedRetryException} when exhausting `producer`.
   */
  execute<T>(producer: () => T): T {
    return this.doOnRetry(producer);
  }

  /**
   * Executing `producer` until exhausting along with `RetryPolicy`.
   * @param {Function} producer
   * @param {Function} another
   * @return {Promise<T>}
   */
  executeOrElse<T>(producer: () => T, another?: () => T): T {
    return this.doOnRetry(producer, another);
  }

  /**
   * Execute and handle error with retrying.
   * @param {Function} producer
   * @param {Function} another
   * @return {T}
   */
  private doOnRetry<T>(producer: () => T, another?: () => T): T {
    while (this.retryPolicy.canRetry(this.retryContext)) {
      try {
        return producer();
      } catch (e) {
        if (this.retryPolicy.shouldNotRetry(e)) {
          console.log(`Not retry catching error [${e.name}]`);
          break;
        }
        console.log(
            `Attempt failed; count => ${this.retryContext.attemptsCount}`,
        );
        this.retryContext.updateLastError(e);
      }
      const delay = this.retryPolicy.getNextDelay();
      this.wait(delay)
          .then((_) => _)
          .catch((e) => console.error(`Error occurred on waiting: ${e}`));
    }
    if (another) {
      return another();
    }
    throw new ExhaustedRetryException('Attempt exhaustetd.');
  }

  /**
   * Wait seconds.
   * @param {Duration} duration
   * @return {Promise<void>}
   */
  private async wait(duration: Duration): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, duration.toMilliSecconds());
    });
  }
}

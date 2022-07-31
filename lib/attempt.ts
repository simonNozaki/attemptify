import {Duration} from './duration';
import {ExhaustedRetryException} from './exception';
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
          console.log(`Not retry catching error [${e.name}]`);
          break;
        }
        console.log(
            `Attempt failed; count => ${this.retryContext.attemptsCount}`,
        );
        this.retryContext.updateLastError(e);
      }
      const delay = this.retryPolicy.getNextDelay();
      console.log(`next waiting ===> ${delay.value}`);
      await this.wait(delay);
    }
    if (another) {
      return await another();
    }
    throw new ExhaustedRetryException('Attempt exhaustetd.');
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

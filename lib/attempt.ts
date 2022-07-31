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
   * @return {Promise<T>}
   */
  async execute<T>(producer: () => T): Promise<T> {
    return this.doOnRetry(producer);
  }

  /**
   *
   * @param {Function} producer
   * @param {Function} another
   * @return {Promise<T>}
   */
  async executeOrElse<T>(producer: () => T, another: () => T): Promise<T> {
    return this.doOnRetry(producer, another);
  }

  /**
   * Trys attempting and handles producers.
   * If `another` is passed, exhausting attempts, execute `another`.
   * @param {Function} producer
   * @param {Function} another
   * @return {Promise<T>}
   */
  private async doOnRetry<T>(producer: () => T, another?: () => T): Promise<T> {
    while (this.retryPolicy.canRetry(this.retryContext)) {
      try {
        return await producer();
      } catch (e) {
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

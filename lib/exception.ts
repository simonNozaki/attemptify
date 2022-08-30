/**
 * Base exception of retrys
 */
export class RetryException extends Error {
  /**
   *
   * @param {string} message
   */
  constructor(
      message?: string,
  ) {
    super(message);
  }
}

/**
 * Exception representing exhausting some retrys
 */
export class ExhaustedRetryException extends Error {
  /**
   * @param {string} message
   */
  constructor(
      message?: string,
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Exception representing exhausting some retrys
 */
export class SpecRetryException extends Error {
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

/**
 * The exception definition that represent a state for illegal object or value.
 */
export class AttemptObjectException extends Error {
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

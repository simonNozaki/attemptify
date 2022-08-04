/**
 * Context for an attemption.
 * There is sometimes needs to consider attempt counts or error context.
 * This object wraps and holds a state of attempt context.
 */
export class RetryContext {
  private _attemptCount = 0;
  private _lastError?: Error;

  // eslint-disable-next-line require-jsdoc
  get attemptsCount(): number {
    return this._attemptCount;
  }

  /**
   * Return Error if a last error is set on this context.
   */
  get lastError(): Error | null {
    return this._lastError;
  }

  /**
   * Update a last error of this attempt context and proceed to a next attempt.
   * @param {Error} e
   */
  updateLastError(e: Error) {
    this._lastError = e;
    this._attemptCount++;
  }
}
